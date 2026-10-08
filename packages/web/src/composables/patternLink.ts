/**
 * 图案深链的唯一真相来源。
 *
 * 每个图案都有一个静态页 `/p/<id>/`（构建时由 scripts/prerender.ts 生成），
 * 这样微信、掘金、Twitter 这些不执行 JS 的抓取器才能读到该图案自己的标题和分享图。
 *
 * `?pattern=<id>` 是早期 MCP 结果和已发布文章里的写法，继续识别，但新链接一律走路径形式。
 */

export function patternPath(id: string): string {
  return `/p/${encodeURIComponent(id)}/`
}

const PATH_PATTERN = /^\/p\/([^/]+)\/?$/

/** 绝对地址，用于系统分享面板和复制链接。 */
export function patternShareUrl(id: string): string {
  return new URL(patternPath(id), window.location.origin).toString()
}

/**
 * 从当前地址解析图案 id：优先认路径形式，其次认旧的查询参数写法。
 * 非法转义（手打的坏链接）会抛错，这里当作「没有指定图案」处理。
 */
export function readPatternIdFromLocation(): string | null {
  const match = PATH_PATTERN.exec(window.location.pathname)
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1])
    }
    catch {
      return null
    }
  }

  return new URLSearchParams(window.location.search).get('pattern')
}

/**
 * 选择变化时应该写回地址栏的 URL。
 *
 * 停在 `/p/<id>/` 上时继续用路径形式（这是该页的 canonical，改变它会让深链失效）；
 * 在首页浏览时则退回查询参数，关掉弹窗即回到干净的首页地址。
 */
export function patternSelectionUrl(id: string | null): string {
  const here = new URL(window.location.href)
  const onPatternPage = PATH_PATTERN.test(here.pathname)

  if (onPatternPage) {
    const target = id ? patternPath(id) : '/'
    return new URL(target, here.origin).toString()
  }

  here.hash = ''
  if (id)
    here.searchParams.set('pattern', id)
  else here.searchParams.delete('pattern')
  return here.toString()
}
