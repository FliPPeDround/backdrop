/**
 * 静态页生成的公共部分：SEO 文案、`<!--seo:start-->` 区块替换、robots 与 sitemap。
 *
 * 这些函数只处理字符串，不碰文件系统，方便单独测试。
 */
import type { Pattern } from '@backdrop/data'
import { PATTERN_CATEGORIES } from '@backdrop/shared'
import { escapeAttr, escapeHtml } from './html'

export const SITE_URL = 'https://mpbackdrop.netlify.app'

const CATEGORY_LABELS = new Map(
  PATTERN_CATEGORIES.map(category => [category.id, category.label]),
)

export function categoryLabel(id: Pattern['category']): string {
  return CATEGORY_LABELS.get(id) ?? id
}

/**
 * 中文显示名。
 *
 * `@backdrop/mcp` 的名字表是用术语拼出来的，遇到重名会补一个英文括号做区分
 * （如「暗蓝径向渐变光晕 (Dark)」）。标题和卡片上英文名就在旁边，这个括号纯属重复，
 * 所以把它去掉——只在括号里含拉丁字母时去掉，避免误伤「（柔和）」这类正经中文补充。
 *
 * 用「非括号字符 + 回溯到最后一个括号」的写法会让 `[^)]*` 和收尾的 `\)` 互相交换字符，
 * 触发灾难性回溯；这里先按位置切开再判断，不做嵌套量词。
 */
export function displayNameZh(nameZh: string): string {
  const trimmed = nameZh.trim()
  const open = Math.max(trimmed.lastIndexOf('('), trimmed.lastIndexOf('（'))
  if (open === -1)
    return trimmed

  const close = trimmed[trimmed.length - 1]
  const closesOpen = (trimmed[open] === '(' && close === ')') || (trimmed[open] === '（' && close === '）')
  if (!closesOpen)
    return trimmed

  const inner = trimmed.slice(open + 1, -1)
  if (!/[a-z]/i.test(inner))
    return trimmed

  return trimmed.slice(0, open).trim() || trimmed
}

export interface DisplayNames {
  /** 干净的中文名，用于已经同时展示英文名的位置（如页面标题）。 */
  clean: string
  /** 中文名，重名时补英文名做区分，用于只出现中文的位置（如 og:title、卡片大标题）。 */
  unique: string
}

/**
 * 一批图案的显示名。
 *
 * 去掉英文括号后会重名（例如「顶部青光晕」同时对应两个图案），只出现中文的地方
 * 就分不出来了。这里算出两种形态：`clean` 给那些旁边已经有英文名的位置，
 * `unique` 给只有中文的位置，只对重名的那几个补英文名。
 */
export function resolveDisplayNames(
  patterns: Array<{ id: string, name: string }>,
  rawNameZh: (id: string) => string | undefined,
): Map<string, DisplayNames> {
  const clean = new Map<string, string>()
  for (const pattern of patterns) {
    const raw = rawNameZh(pattern.id)
    clean.set(pattern.id, raw ? displayNameZh(raw) : pattern.name)
  }

  const counts = new Map<string, number>()
  for (const name of clean.values())
    counts.set(name, (counts.get(name) ?? 0) + 1)

  const resolved = new Map<string, DisplayNames>()
  for (const pattern of patterns) {
    const name = clean.get(pattern.id)!
    resolved.set(pattern.id, {
      clean: name,
      unique: (counts.get(name) ?? 0) > 1 ? `${name}（${pattern.name}）` : name,
    })
  }
  return resolved
}

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/

export interface PageMeta {
  title: string
  description: string
  /** 站点内的绝对路径，如 `/` 或 `/p/beach/`，用来拼 canonical。 */
  path: string
  ogImage: string
  ogType?: 'website' | 'article'
  /** 分享卡片上的一句话，通常比 description 短。 */
  ogTitle?: string
  ogDescription?: string
  /** 分享图的替代文字，读屏和图片加载失败时会用到。 */
  ogImageAlt?: string
  /** 渲染进 `#app` 的静态内容，给不执行 JS 的抓取器看。 */
  fallback?: string
}

/** 从扩展名推断 og:image:type；抓取器会据此判断能不能直接渲染。 */
function imageMimeType(file: string): string {
  return file.endsWith('.png') ? 'image/png' : 'image/jpeg'
}

/**
 * 把模板 `<head>` 里的 seo 区块换成这一页的 meta。
 * 模板必须保留成对的标记，否则抛错——静默失败会让线上多出一页错的 meta。
 */
export function renderHead(template: string, meta: PageMeta): string {
  if (!SEO_BLOCK.test(template)) {
    throw new Error(
      'index.html 里找不到 <!--seo:start-->…<!--seo:end--> 区块，无法写入页面 meta。',
    )
  }

  const canonical = new URL(meta.path, SITE_URL).toString()
  const image = new URL(meta.ogImage, SITE_URL).toString()
  const ogTitle = escapeAttr(meta.ogTitle ?? meta.title)
  const ogDescription = escapeAttr(meta.ogDescription ?? meta.description)

  const block = `<!--seo:start-->
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="${meta.ogType ?? 'website'}" />
    <meta property="og:site_name" content="Backdrop" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:type" content="${imageMimeType(meta.ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeAttr(meta.ogImageAlt ?? ogTitle)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${image}" />
    <!--seo:end-->`

  return template.replace(SEO_BLOCK, block)
}

/** 把静态兜底内容塞进 `#app`；Vue 挂载时会清空它（container.textContent = ''）。 */
export function renderFallback(template: string, fallback: string | undefined): string {
  if (!fallback)
    return template

  const withContent = template.replace(
    /(<div id="app">)[\s\S]*?(<\/div>)/,
    (_match, open: string, close: string) => `${open}${fallback}${close}`,
  )
  if (withContent === template) {
    throw new Error('index.html 里找不到 <div id="app"></div>，无法写入静态兜底内容。')
  }
  return withContent
}

/**
 * 不执行 JS 的抓取器只看得到这里的内容，所以标题和入口都写全。
 *
 * 这层内容平时只在 Vue 挂载前闪一下，但爬虫和关闭 JS 的用户看到的就是它，
 * 所以带一点内联样式——顶层 CSS 里 body 的深色背景此时已经生效，别让文字贴着左上角。
 */
export function patternFallback(pattern: Pattern, nameZh: string, count: number): string {
  const description = pattern.description?.trim()
    ?? `${nameZh}，${categoryLabel(pattern.category)}类小程序背景图案，纯 CSS 实现，不含图片。`

  return [
    '<main style="max-width:42rem;margin:0 auto;padding:18vh 1.5rem 2rem;text-align:center;line-height:1.7">',
    `<h1 style="font-size:2rem;margin:0 0 1rem">${escapeHtml(nameZh)}（${escapeHtml(pattern.name)}）</h1>`,
    `<p style="color:rgba(255,255,255,.7);margin:0 0 .75rem">${escapeHtml(description)}</p>`,
    `<p style="color:rgba(255,255,255,.45);margin:0 0 1.5rem">分类：${escapeHtml(categoryLabel(pattern.category))}</p>`,
    `<p><a href="/" style="color:#fff">在 Backdrop 查看全部 ${count} 个背景图案</a></p>`,
    '</main>',
  ].join('')
}

export function robotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# MCP 端点是给客户端调用的，不是给爬虫抓的页面',
    'Disallow: /mcp',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
}

export interface SitemapEntry {
  path: string
  lastmod?: string
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: string
}

export function sitemapXml(entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => {
    const loc = new URL(entry.path, SITE_URL).toString()
    const parts = [`    <loc>${escapeHtml(loc)}</loc>`]
    if (entry.lastmod)
      parts.push(`    <lastmod>${entry.lastmod}</lastmod>`)
    if (entry.changefreq)
      parts.push(`    <changefreq>${entry.changefreq}</changefreq>`)
    if (entry.priority)
      parts.push(`    <priority>${entry.priority}</priority>`)
    return `  <url>\n${parts.join('\n')}\n  </url>`
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}
