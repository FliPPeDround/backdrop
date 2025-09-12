import type { CSSProperties } from 'vue'
import type { Pattern } from '~/types/pattern'

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
}

const positionStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
}

export const gridPatterns: Pattern[] = [
  {
    id: 'top-gradient-radial',
    name: '顶部径向渐变',
    category: 'decorative',
    description: '从顶部径向渐变，从白色到紫色',
    containerStyle,
    style: {
      ...positionStyle,
      background:
        'radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)',
    },
  },
  {
    id: 'bottom-gradient-radial',
    name: '底部径向渐变',
    category: 'decorative',
    description: '从底部径向渐变，从白色到紫色',
    containerStyle,
    style: {
      ...positionStyle,
      background:
        'radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)',
    },
  },
]
