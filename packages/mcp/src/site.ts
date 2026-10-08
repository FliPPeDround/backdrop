/**
 * The public gallery. The MCP endpoint runs on the same origin, but tool output is copied
 * into other apps, so the canonical host is named once here instead of per call site.
 */
export const SITE_URL = 'https://mpbackdrop.netlify.app'

/**
 * Deep link that opens one pattern's preview on the site.
 *
 * Points at the prerendered `/p/<id>/` page rather than the older `/?pattern=<id>`: that
 * path is what carries the pattern's own title and share image, so a link pasted into a
 * chat renders a card for the pattern instead of the generic site card. The query form
 * still resolves, it just shares worse.
 */
export function patternUrl(id: string): string {
  return `${SITE_URL}/p/${encodeURIComponent(id)}/`
}
