import type { CSSProperties } from 'vue'

export interface Pattern {
  id: string
  name: string
  category: 'gradients' | 'geometric' | 'decorative' | 'effects'
  description?: string
  badge?: 'New' | ' '
  containerStyle?: CSSProperties
  style: CSSProperties
}
