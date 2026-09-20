import type { Pattern } from '../../../data/src/index'
import type { HueFacet } from './synonyms'

export interface PatternFacets {
  /**
   * Colour families present in the pattern's own CSS. Empty means "nothing parseable",
   * which must never be read as "not this colour".
   */
  colours: HueFacet[]
  tone: 'dark' | 'mid' | 'light'
  mood: 'muted' | 'vivid'
}

const COLOUR_PATTERN = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi

interface Swatch {
  h: number
  s: number
  l: number
  alpha: number
}

function parseHex(literal: string): Swatch | undefined {
  const body = literal.slice(1)
  const digits = body.length === 3 || body.length === 4
    ? [...body].map(c => c + c).join('')
    : body
  if (digits.length !== 6 && digits.length !== 8)
    return undefined
  const r = Number.parseInt(digits.slice(0, 2), 16) / 255
  const g = Number.parseInt(digits.slice(2, 4), 16) / 255
  const b = Number.parseInt(digits.slice(4, 6), 16) / 255
  const alpha = digits.length === 8 ? Number.parseInt(digits.slice(6, 8), 16) / 255 : 1
  return toSwatch(r, g, b, alpha)
}

function parseRgb(literal: string): Swatch | undefined {
  const inner = literal.slice(literal.indexOf('(') + 1, -1)
  const parts = inner.split(/[,\s/]+/).filter(Boolean)
  if (parts.length < 3)
    return undefined
  const [r, g, b, a] = parts as [string, string, string, string | undefined]
  const channel = (raw: string) =>
    raw.endsWith('%') ? Number.parseFloat(raw) / 100 : Number.parseFloat(raw) / 255
  // Alpha is 0–1 (or a percentage) in both the legacy and space-separated syntaxes.
  const alpha = a === undefined ? 1 : a.endsWith('%') ? Number.parseFloat(a) / 100 : Number.parseFloat(a)
  const rgb = [channel(r), channel(g), channel(b)]
  if (rgb.some(value => Number.isNaN(value)))
    return undefined
  return toSwatch(rgb[0]!, rgb[1]!, rgb[2]!, alpha)
}

function toSwatch(r: number, g: number, b: number, alpha: number): Swatch | undefined {
  if (Number.isNaN(alpha) || alpha < 0.15)
    return undefined
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const delta = max - min
  if (delta === 0)
    return { h: 0, s: 0, l, alpha }
  const s = delta / (1 - Math.abs(2 * l - 1))
  const hue = max === r
    ? 60 * (((g - b) / delta) % 6)
    : max === g
      ? 60 * ((b - r) / delta + 2)
      : 60 * ((r - g) / delta + 4)
  return { h: (hue + 360) % 360, s, l, alpha }
}

function hueFamily({ h, s, l }: Swatch): HueFacet {
  if (s < 0.12)
    return 'monochrome'
  if (h < 15 || h >= 345)
    return 'red'
  if (h < 45)
    return l < 0.45 ? 'brown' : 'orange'
  if (h < 70)
    return l < 0.55 && s < 0.6 ? 'brown' : 'yellow'
  if (h < 160)
    return 'green'
  if (h < 200)
    return 'cyan'
  if (h < 255)
    return 'blue'
  if (h < 300)
    return 'purple'
  return 'pink'
}

export function readSwatches(css: string): Swatch[] {
  const swatches: Swatch[] = []
  for (const [literal] of [...css.matchAll(COLOUR_PATTERN)]) {
    const swatch = literal.startsWith('#') ? parseHex(literal) : parseRgb(literal)
    if (swatch)
      swatches.push(swatch)
  }
  return swatches
}

export function computeFacets(pattern: Pattern): PatternFacets {
  const swatches = readSwatches(JSON.stringify(pattern.style))
  if (swatches.length === 0)
    return { colours: [], tone: 'mid', mood: 'muted' }

  const weight = swatches.reduce((sum, s) => sum + s.alpha, 0)
  const mean = (pick: (s: Swatch) => number) =>
    swatches.reduce((sum, s) => sum + pick(s) * s.alpha, 0) / weight

  // A white or grey base under a coloured layer is a canvas, not a colour of the
  // pattern; keeping it would tag most of the library as 灰 and drown that query.
  const families = new Set(swatches.map(hueFamily))
  const chromatic = [...families].filter(family => family !== 'monochrome')
  const lightness = mean(s => s.l)
  const saturation = mean(s => s.s)

  return {
    colours: (chromatic.length > 0 ? chromatic : [...families]).sort(),
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
