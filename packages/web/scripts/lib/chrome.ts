/**
 * 一个极小的 CDP 客户端，只做「打开本地 HTML → 截 1200×630 图」这一件事。
 *
 * 用 CDP 而不是 `chrome --screenshot`：进程能复用，批量出图快一个数量级
 * （实测约 83ms/张，258 张二十秒左右），而且能直接拿 JPEG 省掉后处理。
 *
 * 必须用 `--headless=old`：新的 headless 在 `Page.navigate` 之后会重新挂载
 * target，握手时拿到的 session 随即失效，报 "Not attached to an active page"。
 */
import type { ChildProcess } from 'node:child_process'
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'

/** 单次 CDP 调用的上限。正常一次截图约 100ms，超过这个数说明卡住了。 */
const CDP_TIMEOUT_MS = 30_000

/** 找 Chromium：先看 CHROME_PATH，再翻 playwright 缓存和常见安装位置。 */
export function findChrome(): string {
  const fromEnv = process.env.CHROME_PATH
  if (fromEnv && existsSync(fromEnv))
    return fromEnv

  const playwrightVersions = ['chromium-1228', 'chromium-1200', 'chromium-1148']
  const candidates = [
    ...playwrightVersions.map(dir =>
      path.join(
        homedir(),
        'Library/Caches/ms-playwright',
        dir,
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
      ),
    ),
    ...playwrightVersions.map(dir =>
      path.join(homedir(), '.cache/ms-playwright', dir, 'chrome-linux/chrome'),
    ),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]

  const found = candidates.find(candidate => existsSync(candidate))
  if (!found) {
    throw new Error(
      '找不到 Chromium / Chrome。请设置 CHROME_PATH 指向可执行文件后重试。',
    )
  }
  return found
}

interface CdpMessage {
  id?: number
  method?: string
  result?: any
  error?: { code: number, message: string }
}

export interface ChromeSession {
  /** 渲染一个 HTML 字符串并截图，返回图片字节。 */
  capture: (html: string, options?: { format?: 'jpeg' | 'png', quality?: number }) => Promise<Buffer>
  close: () => Promise<void>
}

/**
 * 起一个 Chrome，连上它的第一个 page target，返回可以反复截图的会话。
 *
 * 视口尺寸由调用方给（当前只有 1200×630 的分享卡），不在这里写死，
 * 免得和 cards.ts 里的卡片尺寸各留一份、日后改一个忘一个。
 */
export async function launchChrome(viewport: { width: number, height: number }): Promise<ChromeSession> {
  const executable = findChrome()
  const profile = await mkdtemp(path.join(tmpdir(), 'backdrop-chrome-'))
  const port = 9500 + Math.floor(Math.random() * 400)

  const child: ChildProcess = spawn(
    executable,
    [
      '--headless=old',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      // 容器 / CI 里没有 user namespace 时需要
      '--no-sandbox',
      'about:blank',
    ],
    { stdio: 'ignore' },
  )

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  try {
    let target: { webSocketDebuggerUrl: string } | undefined
    for (let attempt = 0; attempt < 120 && !target; attempt++) {
      if (child.exitCode !== null)
        throw new Error(`Chrome 启动即退出（代码 ${child.exitCode}）`)
      try {
        const list = await fetch(`http://127.0.0.1:${port}/json/list`)
        if (list.ok) {
          const targets = await list.json() as Array<{ type: string, webSocketDebuggerUrl: string }>
          target = targets.find(item => item.type === 'page')
        }
      }
      catch {
        // 端口还没起来，继续等
      }
      if (!target)
        await sleep(120)
    }
    if (!target)
      throw new Error('Chrome 调试端口未就绪')

    const socket = new WebSocket(target.webSocketDebuggerUrl)
    await new Promise<void>((resolve, reject) => {
      socket.addEventListener('open', () => resolve(), { once: true })
      socket.addEventListener('error', () => reject(new Error('CDP 连接失败')), { once: true })
    })

    let nextId = 0
    const pending = new Map<number, (message: CdpMessage) => void>()
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data as string) as CdpMessage
      if (message.id !== undefined && pending.has(message.id)) {
        pending.get(message.id)!(message)
        pending.delete(message.id)
      }
    })

    /**
     * 每个 CDP 调用都带超时。没有超时的话，任何一次不返回的调用都会让整个脚本
     * 静默挂死（本地跑批量出图时踩过一次，几百张图生成完了却卡在最后不退）。
     */
    function send(method: string, params: Record<string, unknown> = {}): Promise<any> {
      return new Promise((resolve, reject) => {
        const id = ++nextId
        const timer = setTimeout(() => {
          pending.delete(id)
          reject(new Error(`${method}: 超过 ${CDP_TIMEOUT_MS}ms 没有响应`))
        }, CDP_TIMEOUT_MS)

        pending.set(id, (message) => {
          clearTimeout(timer)
          if (message.error)
            reject(new Error(`${method}: ${message.error.message}`))
          else
            resolve(message.result)
        })
        socket.send(JSON.stringify({ id, method, params }))
      })
    }

    await send('Page.enable')
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    })

    return {
      async capture(html, options = {}) {
        const format = options.format ?? 'jpeg'
        // 用 document.write 而不是每次都 Page.navigate：导航会反复重建文档，
        // 批量渲染时明显更慢，而 about:blank 上原地替换内容足够干净。
        await send('Runtime.evaluate', {
          expression: `document.open();document.write(${JSON.stringify(html)});document.close();`,
        })
        // 等字体就绪再截图，否则中文字体可能还没应用上。
        // 注意不要用 requestAnimationFrame 等待：--headless=old 下 rAF 不触发，
        // awaitPromise 会永远挂着。fonts.ready 和 setTimeout 都正常。
        await send('Runtime.evaluate', {
          expression: `document.fonts.ready.then(() => new Promise(r => setTimeout(r, 30)))`,
          awaitPromise: true,
        })
        const shot = await send('Page.captureScreenshot', {
          format,
          ...(format === 'jpeg' ? { quality: options.quality ?? 80 } : {}),
        })
        return Buffer.from(shot.data as string, 'base64')
      },
      async close() {
        try {
          socket.close()
        }
        catch {
          // 已经断开
        }
        child.kill()
        await sleep(150)
        await rm(profile, { recursive: true, force: true }).catch(() => {})
      },
    }
  }
  catch (error) {
    child.kill()
    await rm(profile, { recursive: true, force: true }).catch(() => {})
    throw error
  }
}
