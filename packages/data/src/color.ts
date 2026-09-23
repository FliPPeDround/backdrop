import type { CSSProperties } from 'vue'

/**
 * Hue order, so a pattern's own `color` reads as a palette instead of an alphabetical bag.
 * This is the one colour vocabulary: the browse pills and the MCP colour facets both use it,
 * which is what keeps a 蓝 query and a 蓝 pill from disagreeing about what 蓝 means.
 */
export const PATTERN_COLOR_ORDER = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'pink',
  'brown',
  'monochrome',
] as const

export type PatternColor = (typeof PATTERN_COLOR_ORDER)[number]

export interface ColorSwatch {
  h: number
  s: number
  l: number
  alpha: number
}

const COLOUR_PATTERN = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi

interface Rgb {
  r: number
  g: number
  b: number
  a: number
}

function toSwatch({ r, g, b, a }: Rgb): ColorSwatch | undefined {
  if (Number.isNaN(a) || a < 0.15)
    return undefined
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const delta = max - min
  if (delta === 0)
    return { h: 0, s: 0, l, alpha: a }
  const s = delta / (1 - Math.abs(2 * l - 1))
  const hue = max === r
    ? 60 * (((g - b) / delta) % 6)
    : max === g
      ? 60 * ((b - r) / delta + 2)
      : 60 * ((r - g) / delta + 4)
  return { h: (hue + 360) % 360, s, l, alpha: a }
}

function parseHex(literal: string): Rgb | undefined {
  const body = literal.slice(1)
  const digits = body.length === 3 || body.length === 4
    ? [...body].map(c => c + c).join('')
    : body
  if (digits.length !== 6 && digits.length !== 8)
    return undefined
  const channel = (from: number, to: number) =>
    Number.parseInt(digits.slice(from, to), 16) / 255
  return {
    r: channel(0, 2),
    g: channel(2, 4),
    b: channel(4, 6),
    a: digits.length === 8 ? channel(6, 8) : 1,
  }
}

function parseRgb(literal: string): Rgb | undefined {
  const inner = literal.slice(literal.indexOf('(') + 1, -1)
  const parts = inner.split(/[,\s/]+/).filter(Boolean)
  if (parts.length < 3)
    return undefined
  const [r, g, b, a] = parts as [string, string, string, string | undefined]
  // Alpha is 0–1 (or a percentage) in both the legacy and space-separated syntaxes.
  const channel = (raw: string) =>
    raw.endsWith('%') ? Number.parseFloat(raw) / 100 : Number.parseFloat(raw) / 255
  const rgb = [channel(r), channel(g), channel(b)]
  if (rgb.some(value => Number.isNaN(value)))
    return undefined
  return {
    r: rgb[0]!,
    g: rgb[1]!,
    b: rgb[2]!,
    a: a === undefined ? 1 : a.endsWith('%') ? Number.parseFloat(a) / 100 : Number.parseFloat(a),
  }
}

/** Every colour literal a stylesheet paints with, in the order they appear. */
export function readSwatches(css: string): ColorSwatch[] {
  const swatches: ColorSwatch[] = []
  for (const [literal] of [...css.matchAll(COLOUR_PATTERN)]) {
    const rgb = literal.startsWith('#') ? parseHex(literal) : parseRgb(literal)
    const swatch = rgb ? toSwatch(rgb) : undefined
    if (swatch)
      swatches.push(swatch)
  }
  return swatches
}

function hueFamily({ h, s, l }: ColorSwatch): PatternColor {
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

/**
 * The colours of a pattern, proven by its own CSS rather than its name.
 *
 * A white or grey base under a coloured layer is a canvas, not a colour of the pattern;
 * keeping it would tag most of the library as 灰 and drown that query.
 */
export function computePatternColor(style: CSSProperties = {}): PatternColor[] {
  const families = new Set(readSwatches(JSON.stringify(style)).map(hueFamily))
  const chromatic = [...families].filter(family => family !== 'monochrome')
  const present = chromatic.length > 0 ? chromatic : [...families]
  return PATTERN_COLOR_ORDER.filter(family => present.includes(family))
}
