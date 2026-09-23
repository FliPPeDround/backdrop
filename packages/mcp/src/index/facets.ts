import type { Pattern, PatternColor } from '../../../data/src/index'
import { readSwatches } from '../../../data/src/index'

export interface PatternFacets {
  /** The pattern's own CSS palette, read at the data boundary. */
  colours: PatternColor[]
  tone: 'dark' | 'mid' | 'light'
  mood: 'muted' | 'vivid'
}

/**
 * Lightness and saturation, averaged over the same swatches the colour families come from.
 * Geometry and layering are in `computeEffectTags`, which reads properties rather than pixels.
 */
export function computeFacets(pattern: Pattern): PatternFacets {
  const swatches = readSwatches(JSON.stringify(pattern.style))
  if (swatches.length === 0)
    return { colours: [], tone: 'mid', mood: 'muted' }

  const weight = swatches.reduce((sum, s) => sum + s.alpha, 0)
  const mean = (pick: (s: { l: number, s: number }) => number) =>
    swatches.reduce((sum, s) => sum + pick(s) * s.alpha, 0) / weight

  const lightness = mean(s => s.l)
  const saturation = mean(s => s.s)

  return {
    colours: pattern.color,
    tone: lightness < 0.38 ? 'dark' : lightness > 0.72 ? 'light' : 'mid',
    mood: saturation < 0.35 ? 'muted' : 'vivid',
  }
}

/** Gradient geometry and layering that the CSS proves directly, independent of naming. */
export function computeEffectTags(pattern: Pattern): string[] {
  const style = pattern.style as Record<string, unknown>
  const image = String(style.backgroundImage ?? '')
  const tags: string[] = []
  if (/radial-gradient/i.test(image))
    tags.push('radial')
  if (/conic-gradient/i.test(image))
    tags.push('conic')
  if (/repeating-/i.test(image))
    tags.push('repeating')
  if (/linear-gradient/i.test(image))
    tags.push('linear')
  if (style.maskImage != null || style.WebkitMaskImage != null)
    tags.push('mask')
  if (style.animation != null)
    tags.push('animated')
  if (style.filter != null)
    tags.push('filter')
  return tags
}
