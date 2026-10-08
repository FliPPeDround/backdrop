/**
 * 生成分享卡片：
 *   - public/og.png            站点首页（1200×630）
 *   - public/og/<id>.jpg       每个图案一张（1200×630）
 *
 *   pnpm --filter @backdrop/web run gen:og
 *
 * 卡片里的图案用库里真实的 CSS 渲染，所以加图案后重跑即可，不必手工修图。
 * 这些图片会提交到仓库，构建时不再生成——CI 上没有 Chromium 也能正常构建。
 * 找不到浏览器时用 CHROME_PATH 指定。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gridPatterns } from '@backdrop/data'
import { PATTERN_META } from '@backdrop/mcp/pattern-meta'
import { CARD_HEIGHT, CARD_WIDTH, patternCardHtml, siteCardHtml } from './lib/cards'
import { launchChrome } from './lib/chrome'
import { categoryLabel, resolveDisplayNames } from './lib/seo'

const ROOT = path.resolve(import.meta.dirname, '../../..')
const PUBLIC = path.join(ROOT, 'packages/web/public')

/** 站点卡片上展示的三个图案，挑了三种视觉风格各一个。 */
const SITE_CARD_IDS = ['beach', 'purple-gradient-grid-right', 'aurora-waves']

/** 与 scripts/prerender.ts 用同一套去重规则，保证卡片和页面标题一致。 */
const DISPLAY_NAMES = resolveDisplayNames(
  gridPatterns,
  id => PATTERN_META[id]?.nameZh,
)

async function main() {
  const cards = SITE_CARD_IDS.map((id) => {
    const pattern = gridPatterns.find(item => item.id === id)
    if (!pattern)
      throw new Error(`站点分享卡引用了不存在的图案：${id}`)
    return { style: pattern.style }
  })

  const markSvg = await readFile(path.join(ROOT, 'brand/backdrop/mark-white.svg'), 'utf8')

  const session = await launchChrome({ width: CARD_WIDTH, height: CARD_HEIGHT })
  const started = Date.now()
  try {
    const siteBuffer = await session.capture(
      siteCardHtml({ markSvg, count: gridPatterns.length, cards }),
      { format: 'png' },
    )
    await writeFile(path.join(PUBLIC, 'og.png'), siteBuffer)
    console.log(`✓ og.png（站点首页）`)

    const ogDir = path.join(PUBLIC, 'og')
    await mkdir(ogDir, { recursive: true })

    let done = 0
    for (const pattern of gridPatterns) {
      // 卡片副标题里已经写着英文名，大标题用干净的中文名即可
      const nameZh = DISPLAY_NAMES.get(pattern.id)!.clean
      const buffer = await session.capture(
        patternCardHtml({
          nameZh,
          name: pattern.name,
          categoryLabel: categoryLabel(pattern.category),
          count: gridPatterns.length,
          style: pattern.style,
        }),
        { format: 'jpeg', quality: 80 },
      )
      await writeFile(path.join(ogDir, `${pattern.id}.jpg`), buffer)
      done += 1
      if (done % 50 === 0)
        console.log(`  …${done}/${gridPatterns.length}`)
    }

    const seconds = ((Date.now() - started) / 1000).toFixed(0)
    console.log(`✓ og/（${gridPatterns.length} 张图案卡片），用时 ${seconds}s`)
  }
  finally {
    await session.close()
  }
}

await main()
