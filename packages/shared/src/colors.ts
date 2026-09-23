import type { PatternColor } from '@backdrop/data'
import { PATTERN_COLOR_ORDER } from '@backdrop/data'

export interface PatternColorOption {
  id: PatternColor | 'all'
  label: string
  /** Paint for the pill's dot. `all` shows the whole wheel. */
  swatch: string
}

/** 灰 covers black/white/grey, matching the term MCP search answers to with 灰. */
const PILL_COLORS: Record<PatternColor, { label: string, swatch: string }> = {
  red: { label: '红', swatch: '#ef4444' },
  orange: { label: '橙', swatch: '#f97316' },
  yellow: { label: '黄', swatch: '#facc15' },
  green: { label: '绿', swatch: '#4ade80' },
  cyan: { label: '青', swatch: '#22d3ee' },
  blue: { label: '蓝', swatch: '#60a5fa' },
  purple: { label: '紫', swatch: '#c084fc' },
  pink: { label: '粉', swatch: '#f472b6' },
  brown: { label: '棕', swatch: '#b45309' },
  monochrome: { label: '灰', swatch: '#9ca3af' },
}

/** Hue order, so the row reads as a spectrum rather than a bag of chips. */
export const PATTERN_COLORS: PatternColorOption[] = [
  {
    id: 'all',
    label: '全部',
    swatch: 'conic-gradient(from 45deg, #ef4444, #f97316, #facc15, #4ade80, #22d3ee, #60a5fa, #c084fc, #f472b6, #ef4444)',
  },
  ...PATTERN_COLOR_ORDER.map(id => ({ id, ...PILL_COLORS[id] })),
]

export type PatternColorFilter = 'all' | PatternColor
