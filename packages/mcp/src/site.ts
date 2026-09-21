/**
 * The public gallery. The MCP endpoint runs on the same origin, but tool output is copied
 * into other apps, so the canonical host is named once here instead of per call site.
 */
export const SITE_URL = 'https://mpbackdrop.netlify.app'

/** Deep link that opens one pattern's preview on the site. */
export function patternUrl(id: string): string {
  return `${SITE_URL}/?pattern=${encodeURIComponent(id)}`
}
