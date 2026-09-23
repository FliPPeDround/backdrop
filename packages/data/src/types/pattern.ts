import type { CSSProperties } from 'vue'
import type { PatternColor } from '../color'

export interface Pattern {
  id: string
  name: string
  category: 'gradients' | 'geometric' | 'decorative' | 'effects'
  /**
   * Colour families present in `style`, in hue order. A pattern can carry several;
   * one whose CSS holds no readable colour literal carries none.
   */
  color: PatternColor[]
  description?: string
  badge?: 'New' | ' '
  containerStyle?: CSSProperties
  style: CSSProperties
}

/** A pattern as authored, before its CSS has been read for colour. */
export type PatternSource = Omit<Pattern, 'color'>
