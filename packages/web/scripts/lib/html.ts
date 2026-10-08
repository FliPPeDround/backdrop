/** 生成静态页时的最小转义工具。图案名来自仓库数据，这里只是防止意外破坏标记。 */

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 用于 `<meta content="...">` 等属性位置，转义后还要压掉换行。 */
export function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/\s+/g, ' ').trim()
}
