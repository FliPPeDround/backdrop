import type { PatternColorChoice } from '@backdrop/shared'

/**
 * 「全部」不是某一个色相，用一条彩虹表示；其余用共享色板里的实色。
 * 共享色板给「全部」的是 conic-gradient —— 老内核认不出来就是一颗透明点，这里换掉。
 */
const ALL_PAINT = 'linear-gradient(135deg, #ef4444, #f97316, #facc15, #4ade80, #22d3ee, #60a5fa, #c084fc, #f472b6)'

/** 色点的底色。色轨和面板里的色片是同一个轴的两副面孔，底色也该是同一份 */
export function colorPaint(item?: PatternColorChoice) {
  if (!item)
    return {}
  return { background: item.id === 'all' ? ALL_PAINT : item.swatch }
}
