/**
 * 构建后处理：把 Vite 产物补成一份对爬虫和分享抓取器友好的静态站点。
 *
 *   pnpm --filter @backdrop/web run build     # 先出 dist/
 *   pnpm --filter @backdrop/web run prerender # 再跑这一步（build 已自动串上）
 *
 * 做三件事：
 *   1. 为每个图案生成 `/p/<id>/`，各自带标题、描述、canonical 和分享图，
 *      并往 `#app` 里塞一段静态正文——微信、掘金、Twitter 的抓取器不跑 JS。
 *   2. 生成 robots.txt 与 sitemap.xml。
 *   3. 首页 head 里的图案数量按真实数据重写，避免手写的数字过期。
 *
 * 分享图不在这一步生成，见 scripts/gen-og.ts。
 */
import type { Pattern } from '@backdrop/data'
import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { gridPatterns } from '@backdrop/data'
import { PATTERN_META } from '@backdrop/mcp/pattern-meta'
import { patternPath } from '../src/composables/patternLink'
import {
  categoryLabel,
  patternFallback,
  renderFallback,
  renderHead,
  resolveDisplayNames,
  robotsTxt,
  SITE_URL,
  sitemapXml,
} from './lib/seo'

const run = promisify(execFile)

const ROOT = path.resolve(import.meta.dirname, '../../..')
const DIST = path.join(ROOT, 'packages/web/dist')

/**
 * 中文显示名，按 id 索引。
 *
 * 去重后同一批名字两两不同：少数图案去掉英文括号后会重名，这些会补回英文名。
 */
const DISPLAY_NAMES = resolveDisplayNames(
  gridPatterns,
  id => PATTERN_META[id]?.nameZh,
)

/** 图案数据的最后改动时间，作为 sitemap 的 lastmod；取不到就留空。 */
async function dataLastmod(): Promise<string | undefined> {
  try {
    const { stdout } = await run('git', [
      'log',
      '-1',
      '--format=%cs',
      '--',
      'packages/data/src/patterns.ts',
    ], { cwd: ROOT })
    const date = stdout.trim()
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined
  }
  catch {
    return undefined
  }
}

function homepageMeta(count: number) {
  return {
    title: `Backdrop — 小程序背景图案库，${count} 个纯 CSS 图案免费用`,
    description:
      `${count} 个开箱即用的纯 CSS 背景图案，覆盖渐变、几何、装饰与光晕。`
      + '小程序真机效果在线预览，一键复制微信原生 / uni-app / Taro / Wevu 代码，免费开源、无需登录。',
    path: '/',
    ogImage: '/og.png',
    ogTitle: 'Backdrop — 小程序背景图案库',
    ogDescription: `${count} 个纯 CSS 背景图案，真机预览、一键复制代码。免费开源，无需登录。`,
    ogImageAlt: 'Backdrop：为小程序打造的开箱即用背景图案库',
  }
}

function patternMeta(pattern: Pattern, count: number) {
  const { clean: nameZh, unique: nameZhUnique } = DISPLAY_NAMES.get(pattern.id)!
  const label = categoryLabel(pattern.category)
  const suffix = `${nameZh}是 Backdrop 收录的${label}类小程序背景图案，纯 CSS 实现，不依赖图片，可直接复制到项目里。`

  return {
    // 页面标题里紧跟英文名，用 clean 就够了，重名的图案也能靠英文名区分
    title: `${nameZh}（${pattern.name}）· ${label}背景图案 — Backdrop`,
    description: pattern.description?.trim() || suffix,
    path: patternPath(pattern.id),
    ogImage: `/og/${pattern.id}.jpg`,
    ogType: 'article' as const,
    // 分享卡上只有这一行中文，重名的图案要用补过英文名的版本
    ogTitle: `${nameZhUnique} · Backdrop`,
    ogDescription: `${pattern.name} · ${label}分类 · 共 ${count} 个纯 CSS 小程序背景图案`,
  }
}

async function main() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8')
  const count = gridPatterns.length

  // 首页：模板里的数字是手写的，这里按真实数据重写一遍
  const home = renderHead(template, homepageMeta(count))
  await writeFile(path.join(DIST, 'index.html'), home, 'utf8')

  // 图案页
  const { mkdir } = await import('node:fs/promises')
  for (const pattern of gridPatterns) {
    const page = renderFallback(
      renderHead(template, patternMeta(pattern, count)),
      patternFallback(pattern, DISPLAY_NAMES.get(pattern.id)!.clean, count),
    )
    const dir = path.join(DIST, patternPath(pattern.id).replace(/^\//, ''))
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), page, 'utf8')
  }

  await writeFile(path.join(DIST, 'robots.txt'), robotsTxt(), 'utf8')

  const lastmod = await dataLastmod()
  await writeFile(
    path.join(DIST, 'sitemap.xml'),
    sitemapXml([
      { path: '/', lastmod, changefreq: 'weekly', priority: '1.0' },
      ...gridPatterns.map(pattern => ({
        path: patternPath(pattern.id),
        lastmod,
        changefreq: 'monthly' as const,
        priority: '0.6',
      })),
    ]),
    'utf8',
  )

  console.log(`预渲染完成：首页 + ${count} 个图案页 + robots.txt + sitemap.xml`)
  console.log(`站点：${SITE_URL}`)
}

await main()
