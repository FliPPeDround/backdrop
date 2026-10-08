/**
 * 分享卡片（1200×630）的 HTML 模板。
 *
 * 卡片右侧的图案直接用库里真实的 CSS 渲染，所以新增图案后图片会跟着变，
 * 不需要在图片工具里手工维护一份。
 */
import type { CSSProperties } from 'vue'
import { escapeHtml } from './html'

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

/** 覆盖 macOS 与 Linux CI 上常见的中文字体，避免生成时掉成豆腐块。 */
export const FONT_STACK
  = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", '
    + '"Noto Sans CJK SC", "Source Han Sans SC", "WenQuanYi Zen Hei", "Microsoft YaHei", sans-serif'

/** 图案自带的定位是为铺满整屏准备的，塞进卡片里要去掉。 */
const POSITION_KEYS = new Set(['position', 'inset', 'top', 'right', 'bottom', 'left', 'zIndex'])

export function toInlineCss(style: CSSProperties): string {
  return Object.entries(style)
    .filter(([key]) => !POSITION_KEYS.has(key))
    .map(([key, value]) => `${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${value}`)
    .join(';')
}

function shell(title: string, styles: string, body: string): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: ${CARD_WIDTH}px; height: ${CARD_HEIGHT}px; overflow: hidden; }
  body {
    position: relative;
    background: #121212;
    color: #fff;
    font-family: ${FONT_STACK};
    -webkit-font-smoothing: antialiased;
  }
${styles}
</style>
</head>
<body>
${body}
</body>
</html>`
}

/** 站点首页卡片：品牌 + 三张错落的图案缩略图。 */
export function siteCardHtml(options: {
  markSvg: string
  count: number
  cards: Array<{ style: CSSProperties }>
}): string {
  const offsets = [
    { top: 78, right: 236, rotate: -7, w: 268, h: 344, z: 3 },
    { top: 196, right: 60, rotate: 5, w: 268, h: 344, z: 2 },
    { top: 300, right: 300, rotate: -3, w: 236, h: 300, z: 1 },
  ]

  const cards = options.cards.map((card, index) => {
    const spot = offsets[index % offsets.length]!
    return `<div class="card" style="top:${spot.top}px;right:${spot.right}px;width:${spot.w}px;height:${spot.h}px;transform:rotate(${spot.rotate}deg);z-index:${spot.z}">
    <div class="card-fill" style="${toInlineCss(card.style)}"></div>
  </div>`
  }).join('\n  ')

  const styles = `
  .glow {
    position: absolute; inset: 0;
    background:
      radial-gradient(880px 520px at 76% 24%, rgba(123,116,129,.5), transparent 68%),
      radial-gradient(720px 420px at 14% 96%, rgba(99,102,241,.26), transparent 70%);
  }
  .brand { position: absolute; top: 74px; left: 84px; display: flex; align-items: center; gap: 18px; }
  .brand svg { width: 50px; height: 50px; display: block; }
  .brand .name { font-size: 33px; font-weight: 600; letter-spacing: -.02em; }
  .text { position: absolute; left: 84px; top: 214px; width: 660px; }
  h1 { margin: 0; font-size: 82px; line-height: 1.08; font-weight: 700; letter-spacing: -.04em; }
  h1 .dim { color: rgba(255,255,255,.72); }
  .sub { margin-top: 28px; font-size: 27px; line-height: 1.5; color: rgba(255,255,255,.58); }
  .foot { position: absolute; left: 84px; bottom: 74px; display: flex; align-items: center; gap: 18px; }
  .pill {
    font-size: 23px; font-weight: 500; color: rgba(255,255,255,.9);
    padding: 11px 22px; border-radius: 999px;
    background: rgba(255,255,255,.09); border: 1px solid rgba(255,255,255,.16);
  }
  .note { font-size: 22px; color: rgba(255,255,255,.42); }
  .card {
    position: absolute; border-radius: 22px; overflow: hidden;
    border: 1px solid rgba(255,255,255,.2);
    box-shadow: 0 28px 60px rgba(0,0,0,.5);
  }
  .card-fill { width: 100%; height: 100%; }`

  const body = `  <div class="glow"></div>
  <div class="brand">${options.markSvg}<span class="name">Backdrop</span></div>
  <div class="text">
    <h1>为小程序打造<br><span class="dim">背景图案库</span></h1>
    <div class="sub">${options.count} 个纯 CSS 图案 · 真机预览 · 一键复制代码</div>
  </div>
  <div class="foot">
    <span class="pill">mpbackdrop.netlify.app</span>
    <span class="note">MIT · 开源免费 · 无需登录</span>
  </div>
  ${cards}`

  return shell('Backdrop — 小程序背景图案库', styles, body)
}

/** 卡片大标题的字号：名字越长排得越小，保证最长的 12 字也不出框、不折成三行。 */
function headingSize(text: string): number {
  const length = [...text].length
  if (length <= 5)
    return 80
  if (length <= 7)
    return 70
  if (length <= 9)
    return 60
  if (length <= 11)
    return 52
  return 46
}

/** 单个图案的卡片：左边是中文名，右边是该图案渲染出来的真实效果。 */
export function patternCardHtml(options: {
  nameZh: string
  name: string
  categoryLabel: string
  count: number
  style: CSSProperties
}): string {
  const size = headingSize(options.nameZh)

  const styles = `
  .glow {
    position: absolute; inset: 0;
    background: radial-gradient(760px 460px at 74% 42%, rgba(123,116,129,.4), transparent 70%);
  }
  .thumb {
    position: absolute; right: 92px; top: 50%; transform: translateY(-50%);
    width: 336px; height: 438px; border-radius: 30px; overflow: hidden;
    border: 1px solid rgba(255,255,255,.22);
    box-shadow: 0 30px 70px rgba(0,0,0,.55);
  }
  .thumb-fill { width: 100%; height: 100%; }
  .text { position: absolute; left: 88px; top: 50%; transform: translateY(-50%); width: 610px; }
  h1 { margin: 0; font-size: ${size}px; line-height: 1.14; font-weight: 700; letter-spacing: -.03em; }
  .sub { margin-top: 24px; font-size: 26px; line-height: 1.5; color: rgba(255,255,255,.6); }
  .brand { position: absolute; left: 88px; bottom: 62px; font-size: 25px; font-weight: 600; color: rgba(255,255,255,.75); }`

  const body = `  <div class="glow"></div>
  <div class="brand">Backdrop</div>
  <div class="text">
    <h1>${escapeHtml(options.nameZh)}</h1>
    <div class="sub">${escapeHtml(options.name)} · ${escapeHtml(options.categoryLabel)}分类<br>${options.count} 个纯 CSS 小程序背景图案</div>
  </div>
  <div class="thumb"><div class="thumb-fill" style="${toInlineCss(options.style)}"></div></div>`

  return shell(`${options.nameZh} — Backdrop`, styles, body)
}
