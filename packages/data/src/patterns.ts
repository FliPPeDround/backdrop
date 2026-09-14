/**
 * Copyright (c) 2024 megh-bari
 * Source: https://github.com/megh-bari/pattern-craft/blob/main/src/data/patterns.ts
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { CSSProperties } from 'vue'
import type { Pattern } from './types/pattern'

export const patternContainerStyle: CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
}

export const patternLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
}

const containerStyle = patternContainerStyle
const positionStyle = patternLayerStyle

export const gridPatterns: Pattern[] = [
  {
    id: 'beach',
    name: 'Beach',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#E7DFD3',
      backgroundImage: `
        radial-gradient(circle at 50% 50%, transparent 75%, rgba(255,244,190,0.5) 100%),
        linear-gradient(180deg,
        rgba(205, 235, 250, 1) 0%,
        rgba(255, 244, 224, 1) 35%,
        rgba(255, 226, 194, 1) 70%,
        rgba(255, 198, 142, 1) 80%,
        rgba(245, 145, 115, 1) 90%,
        rgba(190, 91, 91, 1) 100%
        )
      `,
    },
  },
  {
    id: 'top-gradient-radial',
    name: 'Top Gradient Radial',
    category: 'decorative',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)',
    },
  },
  {
    id: 'bottom-gradient-radial',
    name: 'Bottom Gradient Radial',
    category: 'decorative',
    description: 'Radial gradient from white to purple starting from bottom',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)',
    },
  },
  {
    id: 'top-violet-radial',
    name: 'Top Violet Radial',
    category: 'decorative',
    description: 'Rich violet from top - luxury feel for premium brands',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)',
    },
  },
  {
    id: 'bottom-violet-radial',
    name: 'Bottom Violet Radial',
    category: 'decorative',
    description: 'Rich violet from bottom - luxury feel for premium brands',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 90%, #fff 40%, #7c3aed 100%)',
    },
  },
  {
    id: 'top-slate-radial',
    name: 'Top Slate Radial',
    category: 'decorative',
    description: 'Sophisticated slate from top - clean and professional',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)',
    },
  },
  {
    id: 'bottom-slate-radial',
    name: 'Bottom Slate Radial',
    category: 'decorative',
    description: 'Sophisticated slate from bottom - clean and professional',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)',
    },
  },
  {
    id: 'top-teal-glow',
    name: 'Top Teal Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'bottom-teal-glow',
    name: 'Bottom Teal Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'top-pink-glow',
    name: 'Top Pink Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #ec4899 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'bottom-pink-glow',
    name: 'Bottom Pink Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'top-amber-glow',
    name: 'Top Amber Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f59e0b 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'bottom-amber-glow',
    name: 'Bottom Amber Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'top-emerald-glow',
    name: 'Top Emerald Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #10b981 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'bottom-emerald-glow',
    name: 'Bottom Emerald Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #10b981 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'dark-horizon-glow',
    name: 'Dark Horizon Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'crimson-depth',
    name: 'Crimson Depth',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: 'radial-gradient(125% 125% at 50% 100%, #000000 40%, #2b0707 100%)',
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'emerald-void',
    name: 'Emerald Void',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: 'radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)',
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'violet-abyss',
    name: 'Violet Abyss',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: 'radial-gradient(125% 125% at 50% 90%, #000000 40%, #2b092b 100%)',
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'azure-depths',
    name: 'Azure Depths',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: 'radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)',
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'orchid -depths',
    name: 'Orchid  Depths',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: 'radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)',
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'dark-horizon-glow-top',
    name: 'Dark Horizon Glow Top',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)',
    },
  },
  {
    id: 'crimson-depth-top',
    name: 'Crimson Depth Top',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)',
    },
  },
  {
    id: 'emerald-void-top',
    name: 'Emerald Void Top',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #000000 40%, #072607 100%)',
    },
  },
  {
    id: 'violet-abyss-top',
    name: 'Violet Abyss Top',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b092b 100%)',
    },
  },
  {
    id: 'azure-depths-top',
    name: 'Azure Depths Top',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)',
    },
  },
  {
    id: 'orchid-depths-top',
    name: 'Orchid Depths Top',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(125% 125% at 50% 10%, #000000 40%, #350136 100%)',
    },
  },
  {
    id: 'purple-gradient-grid-right',
    name: 'Purple Gradient Grid Right',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)
      `,
      backgroundSize: '96px 64px, 96px 64px, 100% 100%',
    },
  },
  {
    id: 'purple-gradient-grid-left',
    name: 'Purple Gradient Grid Left',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        radial-gradient(circle 800px at 0% 200px, #d5c5ff, transparent)
      `,
      backgroundSize: '96px 64px, 96px 64px, 100% 100%',
    },
  },
  {
    id: 'dual-gradient-overlay-strong',
    name: 'Dual Gradient Overlay',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
        radial-gradient(circle 500px at 20% 80%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)
      `,
      backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
    },
  },
  {
    id: 'dual-gradient-overlay-strong-swapped',
    name: 'Dual Gradient Overlay Swapped',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
        radial-gradient(circle 500px at 20% 20%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 80% 80%, rgba(59,130,246,0.3), transparent)
      `,
      backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
    },
  },
  {
    id: 'dual-gradient-overlay-top',
    name: 'Dual Gradient Overlay (Top)',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
        radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
      `,
      backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
    },
  },
  {
    id: 'dual-gradient-overlay-bottom',
    name: 'Dual Gradient Overlay (Bottom)',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
        radial-gradient(circle 500px at 20% 100%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 100% 80%, rgba(59,130,246,0.3), transparent)
      `,
      backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
    },
  },
  {
    id: 'purple-corner-grid',
    name: 'Purple Corner Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
        radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
      `,
      backgroundSize: '20px 20px, 20px 20px, 100% 100%, 100% 100%',
    },
  },
  {
    id: 'grid-dual-purple-glow',
    name: 'Grid Dual Purple Glow',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
        radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
      `,
      backgroundSize: `
        96px 64px,
        96px 64px,
        100% 100%,
        100% 100%
      `,
    },
  },
  {
    id: 'grid-quad-purple-glow',
    name: 'Grid Quad Purple Glow',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),     /* Left */
        radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent),  /* Right */
        radial-gradient(circle 600px at 50% 0px, #d5c5ff, transparent),     /* Top */
        radial-gradient(circle 600px at 50% 100%, #d5c5ff, transparent)     /* Bottom */
      `,
      backgroundSize: `
        96px 64px,
        96px 64px,
        100% 100%,
        100% 100%,
        100% 100%,
        100% 100%
      `,
    },
  },
  {
    id: 'top-fade-grid',
    name: 'Top Fade Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f8fafc',
      backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
      backgroundSize: '20px 30px',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
    },
  },
  {
    id: 'bottom-fade-grid',
    name: 'Bottom Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f8fafc',
      backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
      backgroundSize: '20px 30px',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
    },
  },
  {
    id: 'diagonal-fade-grid-left',
    name: 'Diagonal Fade Grid Left',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f9fafb',
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: '32px 32px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-fade-grid-right',
    name: 'Diagonal Fade Grid Right',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f9fafb',
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: '32px 32px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-fade-bottom-grid-Left',
    name: 'Diagonal Fade Bottom Grid Left',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f9fafb',
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: '32px 32px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-fade-bottom-grid-right',
    name: 'Diagonal Fade Bottom Grid Right',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f9fafb',
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: '32px 32px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-fade-center-grid',
    name: 'Diagonal Fade Center Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f9fafb',
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: '32px 32px',
      WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)',
      maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)',
    },
  },
  {
    id: 'diagonal-cross-grid',
    name: 'Diagonal Cross Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'diagonal-cross-grid-top',
    name: 'Diagonal Cross Grid Top',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
    },
  },
  {
    id: 'diagonal-cross-grid-bottom',
    name: 'Diagonal Cross Grid Bottom',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-cross-top-right-fade-grid',
    name: 'Diagonal Cross Top Right Fade Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-cross-top-left-fade-grid',
    name: 'Diagonal Cross Top Left Fade Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-cross-Bottom-right-fade-grid',
    name: 'Diagonal Cross Bottom Right Fade Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-cross-Bottom-left-fade-grid',
    name: 'Diagonal Cross Bottom Left Fade Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)',
      maskImage: 'radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)',
    },
  },
  {
    id: 'diagonal-cross-center-fade-grid',
    name: 'Diagonal Cross Center Fade Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)',
      maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)',
    },
  },
  {
    id: 'dashed-grid-light',
    name: 'Dashed Grid Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        )
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        )
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'dashed-top-fade-grid',
    name: 'Dashed Top Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'dashed-bottom-fade-grid',
    name: 'Dashed Bottom Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'dashed-top-left-fade-grid',
    name: 'Dashed Top Left Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'dashed-top-right-fade-grid',
    name: 'Dashed Top Right Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'dashed-bottom-right-fade-grid',
    name: 'Dashed Bottom Right Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'dashed-bottom-left-fade-grid',
    name: 'Dashed Bottom Left Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'dashed-center-fade-grid',
    name: 'Dashed Center Fade Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
      `,
      WebkitMaskImage: `
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'left-masked-basic-grid',
    name: 'Left Masked Basic Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 50%, transparent 100%)',
      maskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 50%, transparent 100%)',
    },
  },
  {
    id: 'right-masked-basic-grid',
    name: 'Right Masked Basic Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'left-masked-diagonal-cross-grid',
    name: 'Left Masked Diagonal Cross Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 50%, transparent 100%)',
      maskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 50%, transparent 100%)',
    },
  },
  {
    id: 'right-masked-diagonal-cross-grid',
    name: 'Right Masked Diagonal Cross Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 50%, transparent 100%)',
      maskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 50%, transparent 100%)',
    },
  },
  {
    id: 'left-masked-dashed-grid-light',
    name: 'Left Masked Dashed Grid Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        linear-gradient(to left, black 0%, black 50%, transparent 50%, transparent 100%),
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        )
      `,
      WebkitMaskImage: `
        linear-gradient(to left, black 0%, black 50%, transparent 50%, transparent 100%),
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        )
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'right-masked-dashed-grid-light',
    name: 'Right Masked Dashed Grid Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 0',
      maskImage: `
        linear-gradient(to right, black 0%, black 50%, transparent 50%, transparent 100%),
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        )
      `,
      WebkitMaskImage: `
        linear-gradient(to right, black 0%, black 50%, transparent 50%, transparent 100%),
        repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        ),
        repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
        )
      `,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    },
  },
  {
    id: 'left-masked-concentric-squares-light',
    name: 'Left Masked Concentric Squares - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px),
        repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px)
      `,
      WebkitMaskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'right-masked-concentric-squares-light',
    name: 'Right Masked Concentric Squares - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px),
        repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px)
      `,
      WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'left-masked-circuit-board-light',
    name: 'Left Masked Circuit Board - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
      `,
      backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
      WebkitMaskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'right-masked-circuit-board-light',
    name: 'Right Masked Circuit Board - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
      `,
      backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
      WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'left-masked-circuit-board',
    name: 'Left Masked Circuit Board',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f8fafc',
      backgroundImage: `
        linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(180deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(90deg, #cbd5e1 1px, transparent 1px),
        linear-gradient(180deg, #cbd5e1 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
      WebkitMaskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'right-masked-circuit-board',
    name: 'Right Masked Circuit Board',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f8fafc',
      backgroundImage: `
        linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(180deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(90deg, #cbd5e1 1px, transparent 1px),
        linear-gradient(180deg, #cbd5e1 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
      WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'left-masked-white-grid-with-dots',
    name: 'Left Masked White Grid with Dots',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(51,65,85,0.4) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
      backgroundPosition: '0 0, 0 0, 0 0',
      WebkitMaskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'right-masked-white-grid-with-dots',
    name: 'Right Masked White Grid with Dots',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(51,65,85,0.4) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
      backgroundPosition: '0 0, 0 0, 0 0',
      WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'left-masked-noise-texture-darker-dots',
    name: 'Left Masked Noise Texture (Darker Dots)',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)
      `,
      backgroundSize: '20px 20px',
      WebkitMaskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to left, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'right-masked-noise-texture-darker-dots',
    name: 'Right Masked Noise Texture (Darker Dots)',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)
      `,
      backgroundSize: '20px 20px',
      WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
      maskImage: 'linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)',
    },
  },
  {
    id: 'dark-radial-glow',
    name: 'Dark Radial Glow',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)',
    },
  },
  {
    id: 'blue-radial-glow',
    name: 'Blue Radial Glow',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f172a',
      backgroundImage: 'radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)',
    },
  },
  {
    id: 'purple-radial-glow',
    name: 'Purple Radial Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)',
    },
  },
  {
    id: 'cyan-radial-glow',
    name: 'Cyan Radial Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 100px, rgba(6,182,212,0.4), transparent)',
    },
  },
  {
    id: 'orange-radial-glow',
    name: 'Orange Radial Glow',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 100px, rgba(249,115,22,0.4), transparent)',
    },
  },
  {
    id: 'pink-radial-glow',
    name: 'Pink Radial Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 100px, rgba(236,72,153,0.4), transparent)',
    },
  },
  {
    id: 'gold-radial-glow',
    name: 'Gold Radial Glow',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 100px, rgba(251,191,36,0.4), transparent)',
    },
  },
  {
    id: 'red-radial-glow',
    name: 'Red Radial Glow',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 100px, rgba(239,68,68,0.4), transparent)',
    },
  },
  {
    id: 'lime-radial-glow',
    name: 'Lime Radial Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 100px, rgba(132,204,22,0.4), transparent)',
    },
  },
  {
    id: 'emerald-radial-glow',
    name: 'Emerald Radial Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: 'radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)',
    },
  },
  {
    id: 'aurora-waves',
    name: 'Aurora Waves',
    category: 'gradients',
    description: 'Dynamic aurora borealis inspired wave pattern',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        linear-gradient(45deg, #1a1a1a 0%, #003366 100%),
        repeating-linear-gradient(
        45deg,
        rgba(0, 255, 255, 0.1) 0px,
        rgba(0, 255, 255, 0.1) 20px,
        rgba(0, 255, 0, 0.1) 20px,
        rgba(0, 255, 0, 0.1) 40px
        ),
        radial-gradient(
        circle at 50% 50%,
        rgba(32, 196, 232, 0.3) 0%,
        rgba(76, 201, 240, 0.1) 100%
        )
      `,
      backgroundBlendMode: 'normal, overlay, overlay',
      animation: 'aurora 8s linear infinite',
    },
  },
  {
    id: 'aurora-dream-corner-whispers',
    name: 'Aurora Dream Corner Whispers',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f7eaff',
      backgroundImage: `
        radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
        radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
        radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
        radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'aurora-dream-soft-harmony',
    name: 'Aurora Dream Soft Harmony',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f7eaff',
      backgroundImage: `
        radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'aurora-dream-diagonal-flow',
    name: 'Aurora Dream Diagonal Flow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f7eaff',
      backgroundImage: `
        radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%),
        radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%),
        radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%),
        radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%),
        linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'aurora-dream-vivid-bloom',
    name: 'Aurora Dream Vivid Bloom',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f7eaff',
      backgroundImage: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'dreamy-sky-pink-glow',
    name: 'Dreamy Sky Pink Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fefcff',
      backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%), /* soft blue */
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)  /* soft pink */
      `,
    },
  },
  {
    id: 'peachy-mint-dream',
    name: 'Peachy Mint Dream',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(135deg, #FFB5A7 0%, #F8D7DA 25%, #E8F5E8 75%, #B8F2D0 100%)',
    },
  },
  {
    id: 'soft-pastel-dream',
    name: 'Soft Pastel Dream',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(135deg, #F8BBD9 0%, #FDD5B4 25%, #FFF2CC 50%, #E1F5FE 75%, #BBDEFB 100%)',
    },
  },
  {
    id: 'dreamy-sunset-gradient',
    name: 'Dreamy Sunset Gradient',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f5f5dc',
      backgroundImage: `
        linear-gradient(180deg,
        rgba(245,245,220,1) 0%,
        rgba(255,223,186,0.8) 25%,
        rgba(255,182,193,0.6) 50%,
        rgba(147,112,219,0.7) 75%,
        rgba(72,61,139,0.9) 100%
        ),
        radial-gradient(circle at 30% 20%, rgba(255,255,224,0.4) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(72,61,139,0.6) 0%, transparent 70%),
        radial-gradient(circle at 50% 60%, rgba(147,112,219,0.3) 0%, transparent 60%)
      `,
    },
  },
  {
    id: 'soft-morning-mist',
    name: 'Soft Morning Mist',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f8fafc',
      backgroundImage: `
        linear-gradient(135deg,
        rgba(248,250,252,1) 0%,
        rgba(219,234,254,0.7) 30%,
        rgba(165,180,252,0.5) 60%,
        rgba(129,140,248,0.6) 100%
        ),
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(199,210,254,0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(224,231,255,0.3) 0%, transparent 60%)
      `,
    },
  },
  {
    id: 'peachy-sunrise-glow',
    name: 'Peachy Sunrise Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fff7ed',
      backgroundImage: `
        linear-gradient(180deg,
        rgba(255,247,237,1) 0%,
        rgba(255,237,213,0.8) 25%,
        rgba(254,215,170,0.6) 50%,
        rgba(251,146,60,0.4) 75%,
        rgba(249,115,22,0.3) 100%
        ),
        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 0%, transparent 40%),
        radial-gradient(circle at 80% 20%, rgba(254,215,170,0.5) 0%, transparent 50%),
        radial-gradient(circle at 60% 60%, rgba(252,165,165,0.3) 0%, transparent 45%)
      `,
    },
  },
  {
    id: 'mint-fresh-breeze',
    name: 'Mint Fresh Breeze',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f0fdfa',
      backgroundImage: `
        linear-gradient(45deg,
        rgba(240,253,250,1) 0%,
        rgba(204,251,241,0.7) 30%,
        rgba(153,246,228,0.5) 60%,
        rgba(94,234,212,0.4) 100%
        ),
        radial-gradient(circle at 40% 30%, rgba(255,255,255,0.8) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(167,243,208,0.5) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(209,250,229,0.6) 0%, transparent 45%)
      `,
    },
  },
  {
    id: 'cotton-candy-sky',
    name: 'Cotton Candy Sky',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(45deg, #FFB3D9 0%, #FFD1DC 20%, #FFF0F5 40%, #E6F3FF 60%, #D1E7FF 80%, #C7E9F1 100%)',
    },
  },
  {
    id: 'cotton-candy-sky-reverse',
    name: 'Cotton Candy Sky Reverse',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(225deg, #FFB3D9 0%, #FFD1DC 20%, #FFF0F5 40%, #E6F3FF 60%, #D1E7FF 80%, #C7E9F1 100%)',
    },
  },
  {
    id: 'spring-meadow-mist',
    name: 'Spring Meadow Mist',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(90deg, #D4F1C5 0%, #E8F5E8 20%, #F0F8E8 40%, #FFF9E6 60%, #FFE5B4 80%, #FFDAB9 100%)',
    },
  },
  {
    id: 'ocean-breeze-fade',
    name: 'Ocean Breeze Fade',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(225deg, #B3E5FC 0%, #E0F2F1 25%, #F0F4C3 50%, #FFF8E1 75%, #FFECB3 100%)',
    },
  },
  {
    id: 'lavender-blush-left-flow',
    name: 'Lavender Blush Left Flow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(315deg, #E1BEE7 0%, #F3E5F5 20%, #FCE4EC 40%, #FFF0F5 60%, #F8BBD9 80%, #E1BEE7 100%)',
    },
  },
  {
    id: 'lavender-blush-right-flow',
    name: 'Lavender Blush Right Flow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(135deg, #E1BEE7 0%, #F3E5F5 20%, #FCE4EC 40%, #FFF0F5 60%, #F8BBD9 80%, #E1BEE7 100%)',
    },
  },
  {
    id: 'minty-cloud-drift',
    name: 'Minty Cloud Drift',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(120deg, #C8E6C9 0%, #DCEDC8 20%, #F1F8E9 40%, #FFFDE7 60%, #FFF9C4 80%, #F0F4C3 100%)',
    },
  },
  {
    id: 'rose-gold-whisper',
    name: 'Rose Gold Whisper',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(270deg, #FFECB3 0%, #FFE0B2 20%, #FFCDD2 40%, #F8BBD9 60%, #E1BEE7 80%, #D1C4E9 100%)',
    },
  },
  {
    id: 'aurora-silk-fade',
    name: 'Aurora Silk Fade',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(150deg, #B39DDB 0%, #D1C4E9 20%, #F3E5F5 40%, #FCE4EC 60%, #FFCDD2 80%, #FFAB91 100%)',
    },
  },
  {
    id: 'beige-texture',
    name: 'Warm Beige',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f5f5dc',
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120,119,198,0.1) 0%, transparent 50%)
      `,
    },
  },
  {
    id: 'soft-warm-pastel-texture',
    name: 'Soft Warm Pastel',
    category: 'effects',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fff8f0',
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(255, 182, 153, 0.3) 0%, transparent 50%),  /* soft peach */
        radial-gradient(circle at 80% 20%, rgba(255, 244, 214, 0.5) 0%, transparent 50%),  /* pale buttery yellow */
        radial-gradient(circle at 40% 40%, rgba(255, 182, 153, 0.1) 0%, transparent 50%)   /* lighter peach */
      `,
    },
  },
  {
    id: 'warm-light-apricot-coral',
    name: 'Warm Light Apricot & Coral',
    category: 'effects',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fff9f5',
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(255, 220, 190, 0.3) 0%, transparent 50%),  /* soft apricot */
        radial-gradient(circle at 80% 20%, rgba(255, 245, 238, 0.35) 0%, transparent 50%), /* pale coral cream */
        radial-gradient(circle at 40% 40%, rgba(255, 210, 180, 0.15) 0%, transparent 50%)  /* light coral */
      `,
    },
  },
  {
    id: 'warm-pastel-coral-cream',
    name: 'Warm Soft Coral & Cream',
    category: 'effects',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fef9f7',
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(255, 160, 146, 0.25) 0%, transparent 50%),  /* soft coral */
        radial-gradient(circle at 80% 20%, rgba(255, 244, 228, 0.3) 0%, transparent 50%),  /* pale cream */
        radial-gradient(circle at 40% 40%, rgba(255, 160, 146, 0.15) 0%, transparent 50%)  /* lighter coral */
      `,
    },
  },
  {
    id: 'soft-yellow-glow',
    name: 'Soft Yellow Glow',
    category: 'effects',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        radial-gradient(circle at center, #FFF991 0%, transparent 70%)
      `,
      opacity: 0.6,
      mixBlendMode: 'multiply',
    },
  },
  {
    id: 'soft-dark-yellow-glow',
    name: 'Soft Dark Yellow Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        radial-gradient(circle at center, #ccb755 0%, transparent 70%)
      `,
      opacity: 0.6,
      mixBlendMode: 'multiply',
    },
  },
  {
    id: 'orange-soft-glow',
    name: 'Orange Soft Glow',
    category: 'effects',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        radial-gradient(circle at center, #FF7112, transparent)
      `,
      opacity: 0.3,
      mixBlendMode: 'multiply',
    },
  },
  {
    id: 'soft-green-glow',
    name: 'Soft Green Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        radial-gradient(circle at center, #8FFFB0, transparent)
      `,
    },
  },
  {
    id: 'purple-center-glow',
    name: 'Purple Center Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #8249fc, transparent)
      `,
    },
  },
  {
    id: 'green-center-glow',
    name: 'Green Center Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #10b981, transparent)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'indigo-center-glow',
    name: 'Indigo Center Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #6366f1, transparent)
      `,
    },
  },
  {
    id: 'lime-center-glow',
    name: 'Lime Center  Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #84cc16, transparent)
      `,
    },
  },
  {
    id: 'sunrise-glow',
    name: 'Sunrise Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #eab308, transparent)
      `,
    },
  },
  {
    id: 'soft lavender-center-glow',
    name: 'Soft Lavender Center Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #c4b5fd, transparent)
      `,
    },
  },
  {
    id: 'soft-pink-glow',
    name: 'Soft Pink Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #fbb6ce, transparent)
      `,
    },
  },
  {
    id: 'light-sky-blue-glow',
    name: 'Light Sky Blue Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at center, #93c5fd, transparent)
      `,
    },
  },
  {
    id: 'sunny-glow',
    name: 'Sunny Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fffbe8',
      backgroundImage: `
        radial-gradient(circle at center, #fde047, transparent)
      `,
    },
  },
  {
    id: 'purple-glow-bg',
    name: 'Purple Glow Right',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top right,
        rgba(173, 109, 244, 0.5),
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'teal-glow-bg',
    name: 'Teal Glow Right',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top right,
        rgba(56, 193, 182, 0.5),  /* teal color */
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'warm-orange-glow-bg',
    name: 'Warm Orange Glow Right',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top right,
        rgba(255, 140, 60, 0.5),  /* warm orange */
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'cool-blue-glow-bg',
    name: 'Cool Blue Glow Right',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top right,
        rgba(70, 130, 180, 0.5),  /* steel blue */
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'purple-glow-bg-left',
    name: 'Purple Glow Left',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top left,
        rgba(173, 109, 244, 0.5),
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'teal-glow-bg-left',
    name: 'Teal Glow Left',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top left,
        rgba(56, 193, 182, 0.5),  /* teal color */
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'warm-orange-glow-bg-left',
    name: 'Warm Orange Glow Left',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top left,
        rgba(255, 140, 60, 0.5),  /* warm orange */
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'cool-blue-glow-bg-left',
    name: 'Cool Blue Glow Left',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top left,
        rgba(70, 130, 180, 0.5),  /* steel blue */
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'purple-glow-bg-top',
    name: 'Purple Glow Top',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top center,
        rgba(173, 109, 244, 0.5),
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'teal-glow-bg-top',
    name: 'Teal Glow Top',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top center,
        rgba(56, 193, 182, 0.5),
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'warm-orange-glow-bg-top',
    name: 'Warm Orange Glow Top',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top center,
        rgba(255, 140, 60, 0.5),
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'cool-blue-glow-bg-top',
    name: 'Cool Blue Glow Top',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(
        circle at top center,
        rgba(70, 130, 180, 0.5),
        transparent 70%
        )
      `,
      filter: 'blur(80px)',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'paper-texture',
    name: 'Paper Texture',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#faf9f6',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      `,
      backgroundSize: '8px 8px, 32px 32px, 32px 32px',
    },
  },
  {
    id: 'diagonal-lines',
    name: 'Diagonal Stripes',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)',
    },
  },
  {
    id: 'diagonal-light',
    name: 'Diagonal Grid - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fafafa',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'diagonal-light-green',
    name: 'Diagonal Grid - Electric',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fafafa',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'zigzag-lightning-light',
    name: 'Zigzag Lightning - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(75, 85, 99, 0.08) 20px, rgba(75, 85, 99, 0.08) 21px),
        repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107, 114, 128, 0.06) 30px, rgba(107, 114, 128, 0.06) 31px),
        repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(55, 65, 81, 0.05) 40px, rgba(55, 65, 81, 0.05) 41px),
        repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(31, 41, 55, 0.04) 35px, rgba(31, 41, 55, 0.04) 36px)
      `,
    },
  },
  {
    id: 'circuit-board-light',
    name: 'Circuit Board - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
      `,
      backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
    },
  },
  {
    id: 'concentric-squares-light',
    name: 'Concentric Squares - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px),
        repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px)
      `,
    },
  },
  {
    id: 'woven-fabric-light',
    name: 'Woven Fabric - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(0deg, rgba(75, 85, 99, 0.08), rgba(75, 85, 99, 0.08) 2px, transparent 2px, transparent 6px),
        repeating-linear-gradient(90deg, rgba(107, 114, 128, 0.06), rgba(107, 114, 128, 0.06) 2px, transparent 2px, transparent 6px),
        repeating-linear-gradient(0deg, rgba(55, 65, 81, 0.04), rgba(55, 65, 81, 0.04) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(90deg, rgba(55, 65, 81, 0.04), rgba(55, 65, 81, 0.04) 1px, transparent 1px, transparent 12px)
      `,
    },
  },
  {
    id: 'crosshatch-art-light',
    name: 'Crosshatch Art - Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      `,
    },
  },
  {
    id: 'white-grid-with-dots',
    name: 'White Grid with Dots',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(51,65,85,0.4) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
      backgroundPosition: '0 0, 0 0, 0 0',
    },
  },
  {
    id: 'noise-texture-darker-dots',
    name: 'Noise Texture (Darker Dots)',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)
      `,
      backgroundSize: '20px 20px',
    },
  },
  {
    id: 'circuit-board',
    name: 'Circuit Board',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#f8fafc',
      backgroundImage: `
        linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(180deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(90deg, #cbd5e1 1px, transparent 1px),
        linear-gradient(180deg, #cbd5e1 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
    },
  },
  {
    id: 'basic-grid',
    name: 'Basic Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'white-sphere-grid',
    name: 'White Sphere Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.1) 40%, transparent 80%)
      `,
      backgroundSize: '32px 32px, 32px 32px, 100% 100%',
    },
  },
  {
    id: 'magenta-orb-grid-light',
    name: 'Magenta Orb Grid Light',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'white',
      backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
    },
  },
  {
    id: 'dark-sphere-grid',
    name: 'Dark Sphere Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
      `,
      backgroundSize: '32px 32px, 32px 32px, 100% 100%',
    },
  },
  {
    id: 'magenta-orb-grid',
    name: 'Magenta Orb Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
    },
  },
  {
    id: 'dark-basic-grid-slate',
    name: 'Dark Basic Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: `
        linear-gradient(to right, rgba(100,116,139,0.4) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(100,116,139,0.4) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'dark-basic-grid-faded',
    name: 'Dark Basic Grid (Faded)',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f172a',
      backgroundImage: `
        linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'black-basic-grid',
    name: 'Black Basic Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'vercel-grid-subtle',
    name: 'Vercel Grid Subtle',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    },
  },
  {
    id: 'dark-grid-lines',
    name: 'Dark Grid Lines',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        linear-gradient(to right, #262626 1px, transparent 1px),
        linear-gradient(to bottom, #262626 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
    },
  },
  {
    id: 'pixel-grid-pattern',
    name: 'Pixel Grid Pattern',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundColor: '#000000',
      backgroundImage: `
        linear-gradient(#333333 1px, transparent 1px),
        linear-gradient(90deg, #333333 1px, transparent 1px)
      `,
      backgroundSize: '8px 8px',
      imageRendering: 'pixelated',
    },
  },
  {
    id: 'neon-vertical-lines',
    name: 'Neon Vertical Lines',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 79px,
        rgba(255, 255, 255, 0.05) 80px,
        rgba(255, 255, 255, 0.05) 81px
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'dark-dot-matrix',
    name: 'Dark Dot Matrix',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundColor: '#0a0a0a',
      backgroundImage: `
        radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
        radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
      `,
      backgroundSize: '10px 10px',
      imageRendering: 'pixelated',
    },
  },
  {
    id: 'small-grid',
    name: 'Small Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        linear-gradient(to right, #262626 1px, transparent 1px),
        linear-gradient(to bottom, #262626 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
    },
  },
  {
    id: 'black-grid-white-dots',
    name: 'Black Grid with White Dots',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
      backgroundPosition: '0 0, 0 0, 0 0',
    },
  },
  {
    id: 'dark-grid-white-dots',
    name: 'Dark Grid with White Dots',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f172a',
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
      backgroundPosition: '0 0, 0 0, 0 0',
    },
  },
  {
    id: 'dark-dotted-grid',
    name: 'Dark Dotted Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f172a',
      backgroundImage: `
        radial-gradient(circle, rgba(139,92,246,0.6) 1px, transparent 1px),
        radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px),
        radial-gradient(circle, rgba(236,72,153,0.5) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 40px 40px, 60px 60px',
      backgroundPosition: '0 0, 10px 10px, 30px 30px',
    },
  },
  {
    id: 'dark-white-dotted-grid',
    name: 'Dark White Dotted Grid',
    category: 'geometric',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)
      `,
      backgroundSize: '30px 30px',
      backgroundPosition: '0 0',
    },
  },
  {
    id: 'dark-noise-colored-high',
    name: 'Dark Noise Colored',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
      `,
      backgroundSize: '20px 20px, 30px 30px, 25px 25px',
      backgroundPosition: '0 0, 10px 10px, 15px 5px',
    },
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
      `,
      backgroundSize: '24px 24px, 24px 24px, 8px 8px',
    },
  },
  {
    id: 'diagonal-green-glow',
    name: 'Diagonal Grid - Green Glow',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'diagonal-red/blue-glow',
    name: 'Diagonal Grid - Red/Blue Glow',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 200, 0.15) 0, rgba(0, 255, 200, 0.15) 1px, transparent 1px, transparent 20px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'diagonal-electric erange',
    name: 'Diagonal Grid - Electric Orange',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
        repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
      `,
      backgroundSize: '44px 44px',
    },
  },
  {
    id: 'complex-multiplier',
    name: 'Complex Multiplier',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#101014',
      backgroundImage: `
        repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
        repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
        radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)
      `,
      backgroundSize: '80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%',
      backgroundPosition: '0 0, 0 0, 0 0, 40px 40px, center',
    },
  },
  {
    id: 'hexagonal-lines',
    name: 'Hexagonal Lines',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(60deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 22px),
        repeating-linear-gradient(-60deg, rgba(0, 255, 200, 0.15) 0, rgba(0, 255, 200, 0.15) 1px, transparent 1px, transparent 22px),
        repeating-linear-gradient(0deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 22px)
      `,
      backgroundSize: '44px 44px',
    },
  },
  {
    id: 'diagonal-synthwave',
    name: 'Diagonal Grid - Synthwave',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0a0a0a',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(255, 20, 147, 0.15) 0, rgba(255, 20, 147, 0.15) 2px, transparent 2px, transparent 30px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 255, 0.1) 0, rgba(0, 255, 255, 0.1) 1px, transparent 1px, transparent 25px)
      `,
      backgroundSize: '40px 40px',
    },
  },
  {
    id: 'gradient-left-diagonal-lines',
    name: 'Gradient Left Diagonal Lines',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(45deg,
        rgba(0, 255, 128, 0.2) 0px,
        rgba(0, 255, 128, 0) 2px,
        transparent 2px,
        transparent 25px
        )
      `,
    },
  },
  {
    id: 'gradient-right-diagonal-lines',
    name: 'Gradient Right Diagonal Lines',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(-45deg,
        rgba(255, 0, 100, 0.2) 0px,
        rgba(255, 0, 100, 0) 2px,
        transparent 2px,
        transparent 25px
        )
      `,
    },
  },
  {
    id: 'cross-diagonal-lines',
    name: 'Cross Diagonal Lines',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px)
      `,
    },
  },
  {
    id: 'multi-cross-diagonal-lines',
    name: 'Multi Cross Diagonal Lines',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.2) 0, rgba(255, 0, 100, 0.2) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(45deg, rgba(0, 255, 128, 0.2) 0, rgba(0, 255, 128, 0.2) 1px, transparent 1px, transparent 20px)
      `,
    },
  },
  {
    id: 'variable-spacing',
    name: 'Variable Spacing',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(30deg,
        rgba(255, 100, 0, 0.1) 0,
        rgba(255, 100, 0, 0.1) 1px,
        transparent 1px,
        transparent 10px,
        rgba(255, 100, 0, 0.15) 11px,
        rgba(255, 100, 0, 0.15) 12px,
        transparent 12px,
        transparent 40px
        )
      `,
    },
  },
  {
    id: 'circuit-board-vibes',
    name: 'Circuit Board Vibes',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(0deg,
        rgba(0, 255, 0, 0.12) 0, rgba(0, 255, 0, 0.12) 1px,
        transparent 1px, transparent 40px
        ),
        repeating-linear-gradient(90deg,
        rgba(0, 255, 0, 0.08) 0, rgba(0, 255, 0, 0.08) 1px,
        transparent 1px, transparent 80px
        ),
        repeating-linear-gradient(45deg,
        rgba(255, 100, 0, 0.10) 0, rgba(255, 100, 0, 0.10) 1px,
        transparent 1px, transparent 160px
        )
      `,
      backgroundSize: '80px 80px, 160px 160px, 320px 320px',
    },
  },
  {
    id: 'zigzag-lightning-dark',
    name: 'Zigzag Lightning - Dark',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(34, 197, 94, 0.12) 20px, rgba(34, 197, 94, 0.12) 21px),
        repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(16, 185, 129, 0.10) 30px, rgba(16, 185, 129, 0.10) 31px),
        repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(59, 130, 246, 0.08) 40px, rgba(59, 130, 246, 0.08) 41px),
        repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(147, 51, 234, 0.06) 35px, rgba(147, 51, 234, 0.06) 36px)
      `,
    },
  },
  {
    id: 'circuit-board-dark',
    name: 'Circuit Board - Dark',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(34, 197, 94, 0.15) 19px, rgba(34, 197, 94, 0.15) 20px, transparent 20px, transparent 39px, rgba(34, 197, 94, 0.15) 39px, rgba(34, 197, 94, 0.15) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(34, 197, 94, 0.15) 19px, rgba(34, 197, 94, 0.15) 20px, transparent 20px, transparent 39px, rgba(34, 197, 94, 0.15) 39px, rgba(34, 197, 94, 0.15) 40px),
        radial-gradient(circle at 20px 20px, rgba(16, 185, 129, 0.18) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(16, 185, 129, 0.18) 2px, transparent 2px)
      `,
      backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
    },
  },
  {
    id: 'dark-circuit-board',
    name: 'Dark Circuit Board',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      backgroundColor: '#171717',
      backgroundImage: `
        linear-gradient(90deg, #171717 1px, transparent 1px),
        linear-gradient(180deg, #171717 1px, transparent 1px),
        linear-gradient(90deg, #262626 1px, transparent 1px),
        linear-gradient(180deg, #262626 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
    },
  },
  {
    id: 'concentric-squares-dark',
    name: 'Concentric Squares - Dark',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(99, 102, 241, 0.15) 5px, rgba(99, 102, 241, 0.15) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(99, 102, 241, 0.15) 5px, rgba(99, 102, 241, 0.15) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(139, 92, 246, 0.12) 10px, rgba(139, 92, 246, 0.12) 11px, transparent 11px, transparent 30px),
        repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 92, 246, 0.12) 10px, rgba(139, 92, 246, 0.12) 11px, transparent 11px, transparent 30px)
      `,
    },
  },
  {
    id: 'crosshatch-art-dark',
    name: 'Crosshatch Art - Dark',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f0f',
      backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)
      `,
    },
  },
  {
    id: 'aurora-midnight-glow',
    name: 'Aurora Midnight Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'crimson-shadow-glow',
    name: 'Crimson Shadow Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 80, 120, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'emerald-depths-glow',
    name: 'Emerald Depths Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16, 185, 129, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'violet-storm-glow',
    name: 'Violet Storm Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'golden-horizon-glow',
    name: 'Golden Horizon Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251, 191, 36, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'ocean-abyss-glow',
    name: 'Ocean Abyss Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'rose-twilight-glow',
    name: 'Rose Twilight Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244, 114, 182, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'copper-forge-glow',
    name: 'Copper Forge Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'arctic-lights-glow',
    name: 'Arctic Lights Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'indigo-cosmos-glow',
    name: 'Indigo Cosmos Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'pearl-mist-glow',
    name: 'Pearl Mist Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000',
    },
  },
  {
    id: 'magenta-nebula-glow',
    name: 'Magenta Nebula Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236, 72, 153, 0.25), transparent 70%), #000000',
    },
  },
  {
    id: 'pink-aurora-top',
    name: 'Pink Aurora Top',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at top,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 140, 250, 0.08) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'crystal-maze',
    name: 'Crystal Maze',
    category: 'effects',
    description: 'Elegant crystalline pattern with subtle prismatic reflections',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        repeating-linear-gradient(
        60deg,
        transparent 0px,
        transparent 1px,
        rgba(255, 255, 255, 0.05) 1px,
        rgba(255, 255, 255, 0.05) 2px
        ),
        repeating-linear-gradient(
        -60deg,
        transparent 0px,
        transparent 1px,
        rgba(255, 255, 255, 0.05) 1px,
        rgba(255, 255, 255, 0.05) 2px
        ),
        linear-gradient(
        60deg,
        rgba(43, 108, 176, 0.4) 0%,
        rgba(72, 126, 176, 0.4) 33%,
        rgba(95, 142, 176, 0.4) 66%,
        rgba(116, 157, 176, 0.4) 100%
        ),
        radial-gradient(
        circle at 50% 50%,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 50%
        )
      `,
      backgroundBlendMode: 'overlay, overlay, normal, screen',
      animation: 'crystal-shimmer 15s ease-in-out infinite',
    },
  },
  {
    id: 'moonlit-fog',
    name: 'Moonlit Fog',
    category: 'effects',
    description: 'Soft, ethereal gradient inspired by moonlit foggy nights',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 30% 70%, rgba(176, 196, 222, 0.15) 0%, transparent 50%),
        linear-gradient(135deg,
        #2c3e50 0%,
        #3a506b 25%,
        #435e79 50%,
        #516b87 75%,
        #5f7995 100%
        )
      `,
      backgroundBlendMode: 'soft-light, screen, normal',
      filter: 'brightness(1.05) contrast(1.05)',
    },
  },
  {
    id: 'pastel-wave',
    name: 'Pastel Wave',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(120deg, #d5c5ff 0%, #a7f3d0 50%, #f0f0f0 100%)',
    },
  },
  {
    id: 'soft-blue-radial',
    name: 'Soft Blue Radial',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at top center, rgba(59, 130, 246, 0.5), transparent 70%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'morning-haze',
    name: 'Morning Haze',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle at 50% 100%, rgba(253, 224, 71, 0.4) 0%, transparent 60%),
        radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.4) 0%, transparent 70%),
        radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.5) 0%, transparent 80%)
      `,
    },
  },
  {
    id: 'midnight-mist',
    name: 'Midnight Mist',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
        radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
        radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
      `,
    },
  },
  {
    id: 'aurora-mystic-mist',
    name: 'Aurora Mystic Mist',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 50% 100%, rgba(58, 175, 169, 0.6) 0%, transparent 60%),
        radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
        radial-gradient(circle at 50% 100%, rgba(238, 130, 238, 0.3) 0%, transparent 80%)
      `,
    },
  },
  {
    id: 'tropical-dusk-glow',
    name: 'Tropical Dusk Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 50% 100%, rgba(255, 99, 71, 0.6) 0%, transparent 60%), /* tomato red */
        radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.4) 0%, transparent 70%), /* gold */
        radial-gradient(circle at 50% 100%, rgba(60, 179, 113, 0.3) 0%, transparent 80%) /* medium sea green */
      `,
    },
  },
  {
    id: 'ember-glow',
    name: 'Ember Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%), /* orange red */
        radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%), /* dark orange */
        radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%) /* gold */
      `,
    },
  },
  {
    id: 'cosmic-aurora',
    name: 'Cosmic Aurora',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0a0a0a',
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
      `,
    },
  },
  {
    id: 'midnight-ember',
    name: 'Midnight Ember',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse at center, #3d2914 0%, #2a1810 30%, #1a0f0a 60%, #0d0806 100%)',
    },
  },
  {
    id: 'deep-ocean-glow',
    name: 'Deep Ocean Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(70% 55% at 50% 50%, #2a5d77 0%, #184058 18%, #0f2a43 34%, #0a1b30 50%, #071226 66%, #040d1c 80%, #020814 92%, #01040d 97%, #000309 100%), radial-gradient(160% 130% at 10% 10%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%), radial-gradient(160% 130% at 90% 90%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%)',
    },
  },
  {
    id: 'cosmic-noise',
    name: 'Cosmic Noise',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%), linear-gradient(120deg, #0f0e17 0%, #1a1b26 100%)',
    },
  },
  {
    id: 'volcanic-ember',
    name: 'Volcanic Ember',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        radial-gradient(ellipse 120% 70% at 70% 80%, rgba(87, 24, 69, 0.20), transparent 52%),
        radial-gradient(ellipse 160% 45% at 30% 30%, rgba(153, 27, 27, 0.16), transparent 58%),
        radial-gradient(ellipse 85% 100% at 10% 60%, rgba(69, 26, 3, 0.22), transparent 46%),
        #1c1917
      `,
    },
  },
  {
    id: 'crimson-core-glow',
    name: 'Crimson Core Glow',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505',
    },
  },
  {
    id: 'northern-aurora',
    name: 'Northern Aurora',
    category: 'effects',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.15), transparent 50%),
        radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
        radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.18), transparent 65%),
        radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
        #000000
      `,
    },
  },
  {
    id: 'cosmic-sparkle',
    name: 'Cosmic Sparkle',
    category: 'effects',
    description: 'Starry night sky effect with twinkling dots',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.08) 10%, transparent 55%),
        radial-gradient(circle at 50% 50%, #111 0%, #1a1a1a 100%)
      `,
      backgroundBlendMode: 'soft-light',
      boxShadow: `
        inset 0 0 60px rgba(255, 255, 255, 0.3),
        inset 20px 0 80px rgba(255, 0, 255, 0.2),
        inset -20px 0 80px rgba(0, 255, 255, 0.2),
        inset 20px 0 300px rgba(255, 0, 255, 0.1),
        inset -20px 0 300px rgba(0, 255, 255, 0.1),
        0 0 50px rgba(255, 255, 255, 0.1),
        -10px 0 80px rgba(255, 0, 255, 0.1),
        10px 0 80px rgba(0, 255, 255, 0.1)
      `,
      filter: 'contrast(1.05) brightness(1.05) blur(0.5px)',
    },
  },
  {
    id: 'striped-dark',
    name: 'Striped Dark',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'repeating-linear-gradient(45deg, #000 0px, #111 2px, #000 4px, #222 6px)',
    },
  },
  {
    id: 'midnight-aurora-glow',
    name: 'Midnight Aurora Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(58, 123, 255, 0.25) 0%,       /* Electric Blue */
        rgba(100, 149, 237, 0.15) 25%,    /* Cornflower Blue */
        rgba(123, 104, 238, 0.07) 35%,    /* Medium Slate Blue */
        transparent 50%
        )
      `,
    },
  },
  {
    id: 'midnight-radial-glow',
    name: 'Midnight Radial Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(226, 232, 240, 0.2) 0%,
        rgba(226, 232, 240, 0.1) 25%,
        rgba(226, 232, 240, 0.05) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'deep-navy-gold',
    name: 'Deep Navy & Gold',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f172a',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(251, 191, 36, 0.15) 0%,
        rgba(251, 191, 36, 0.08) 25%,
        rgba(251, 191, 36, 0.03) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'rich-burgundy',
    name: 'Rich Burgundy',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#1c1917',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(220, 38, 38, 0.2) 0%,
        rgba(220, 38, 38, 0.12) 25%,
        rgba(220, 38, 38, 0.06) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'forest-emerald',
    name: 'Forest Emerald',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#111827',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(34, 197, 94, 0.18) 0%,
        rgba(34, 197, 94, 0.1) 25%,
        rgba(34, 197, 94, 0.04) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#18181b',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(147, 51, 234, 0.2) 0%,
        rgba(147, 51, 234, 0.12) 25%,
        rgba(147, 51, 234, 0.05) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'copper-bronze',
    name: 'Copper & Bronze',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#1c1917',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(194, 65, 12, 0.18) 0%,
        rgba(194, 65, 12, 0.1) 25%,
        rgba(194, 65, 12, 0.04) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0c0a09',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(59, 130, 246, 0.16) 0%,
        rgba(59, 130, 246, 0.09) 25%,
        rgba(59, 130, 246, 0.04) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#0f0f23',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(245, 158, 11, 0.14) 0%,
        rgba(245, 158, 11, 0.08) 25%,
        rgba(245, 158, 11, 0.03) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'moonlight-silver',
    name: 'Moonlight Silver',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#020617',
      backgroundImage: `
        radial-gradient(circle at 50% 50%,
        rgba(203, 213, 225, 0.12) 0%,
        rgba(203, 213, 225, 0.07) 25%,
        rgba(203, 213, 225, 0.03) 35%,
        transparent 50%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-white',
    name: 'White Spotlight',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.04) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-blue',
    name: 'Blue Spotlight',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(59, 130, 246, 0.12) 0%,
        rgba(59, 130, 246, 0.06) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-emerald',
    name: 'Emerald Spotlight',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(34, 197, 94, 0.12) 0%,
        rgba(34, 197, 94, 0.06) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-crimson',
    name: 'Crimson Spotlight',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(239, 68, 68, 0.12) 0%,
        rgba(239, 68, 68, 0.06) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-violet',
    name: 'Violet Spotlight',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(168, 85, 247, 0.12) 0%,
        rgba(168, 85, 247, 0.06) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-amber',
    name: 'Amber Spotlight',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(245, 158, 11, 0.12) 0%,
        rgba(245, 158, 11, 0.06) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-cyan',
    name: 'Cyan Spotlight',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(6, 182, 212, 0.12) 0%,
        rgba(6, 182, 212, 0.06) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight-rose',
    name: 'Rose Spotlight',
    category: 'gradients',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(244, 63, 94, 0.12) 0%,
        rgba(244, 63, 94, 0.06) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'center-spotlight',
    name: 'Center Spotlight',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.04) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'top-spotlight',
    name: 'Top Spotlight',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(
        circle at top,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.08) 20%,
        rgba(0, 0, 0, 0.0) 60%
        )
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'aurora-edge-glow',
    name: 'Aurora Edge Glow',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#000000',
      backgroundImage: `
        radial-gradient(ellipse 50% 100% at 10% 0%, rgba(226, 232, 240, 0.15), transparent 65%)
      `,
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'purple-radial-bloom-light',
    name: 'Purple Radial Bloom Light',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(circle at center, #F3E8FF 0%, #DDD6FE 30%, #C4B5FD 60%, #A78BFA 100%)',
    },
  },
  {
    id: 'purple-corner-less',
    name: 'Purple Corner Less',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
        radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
      `,
    },
  },
  {
    id: 'purple-corner-high',
    name: 'Purple Corner High',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #a99bf7, transparent),
        radial-gradient(circle 600px at 100% 200px, #a99bf7, transparent)
      `,
    },
  },
  {
    id: 'blue-corner-glow',
    name: 'Blue Corner Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #bfdbfe, transparent),
        radial-gradient(circle 600px at 100% 200px, #bfdbfe, transparent)
      `,
    },
  },
  {
    id: 'green-corner-soft',
    name: 'Green Corner Soft',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #bbf7d0, transparent),
        radial-gradient(circle 600px at 100% 200px, #bbf7d0, transparent)
      `,
    },
  },
  {
    id: 'pink-corner-dream',
    name: 'Pink Corner Dream',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #fce7f3, transparent),
        radial-gradient(circle 600px at 100% 200px, #fce7f3, transparent)
      `,
    },
  },
  {
    id: 'orange-corner-warm',
    name: 'Orange Corner Warm',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #fed7aa, transparent),
        radial-gradient(circle 600px at 100% 200px, #fed7aa, transparent)
      `,
    },
  },
  {
    id: 'teal-corner-cool',
    name: 'Teal Corner Cool',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #a7f3d0, transparent),
        radial-gradient(circle 600px at 100% 200px, #a7f3d0, transparent)
      `,
    },
  },
  {
    id: 'yellow-corner-bright',
    name: 'Yellow Corner Bright',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #fef3c7, transparent),
        radial-gradient(circle 600px at 100% 200px, #fef3c7, transparent)
      `,
    },
  },
  {
    id: 'indigo-corner-deep',
    name: 'Indigo Corner Deep',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #c7d2fe, transparent),
        radial-gradient(circle 600px at 100% 200px, #c7d2fe, transparent)
      `,
    },
  },
  {
    id: 'rose-corner-elegant',
    name: 'Rose Corner Elegant',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #fda4af, transparent),
        radial-gradient(circle 600px at 100% 200px, #fda4af, transparent)
      `,
    },
  },
  {
    id: 'violet-dream-sphere',
    name: 'Violet Dream Sphere',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(ellipse at center, #DDD6FE 0%, #C4B5FD 25%, #A78BFA 50%, #8B5CF6 75%, #7C3AED 100%)',
    },
  },
  {
    id: 'lavender-cosmic-glow',
    name: 'Lavender Cosmic Glow',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(circle at 40% 40%, #E9D5FF 0%, #C4B5FD 20%, #A78BFA 40%, #8B5CF6 60%, #6D28D9 80%, #581C87 100%)',
    },
  },
  {
    id: 'purple-haze-burst',
    name: 'Purple Haze Burst',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(circle at 30% 60%, #F3E8FF 0%, #DDD6FE 15%, #C4B5FD 30%, #A78BFA 45%, #8B5CF6 60%, #7C3AED 75%, #5B21B6 90%, #4C1D95 100%)',
    },
  },
  {
    id: 'mystic-purple-orb',
    name: 'Mystic Purple Orb',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: 'radial-gradient(circle at 50% 30%, #E9D5FF 0%, #C4B5FD 25%, #A78BFA 50%, #7C3AED 75%, #5B21B6 100%)',
    },
  },
  {
    id: 'soft-rose-glow-right-corner',
    name: 'Soft Rose Glow Right Corner',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fff8fc',
      backgroundImage: `
        radial-gradient(circle 850px at 90% 90%, #f984e5, transparent)
      `,
    },
  },
  {
    id: 'soft-rose-glow-left-corner',
    name: 'Soft Rose Glow Left Corner',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fff8fc',
      backgroundImage: `
        radial-gradient(circle 850px at 10% 10%, #f984e5, transparent)
      `,
    },
  },
  {
    id: 'soft-rose-glow-corners',
    name: 'Soft Rose Glow Dual Corners',
    category: 'decorative',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#fff8fc',
      backgroundImage: `
        radial-gradient(circle 850px at 10% 10%, #f984e5, transparent),
        radial-gradient(circle 850px at 90% 90%, #f984e5, transparent)
      `,
    },
  },
  {
    id: 'prismatic-aurora-burst',
    name: 'Prismatic Aurora Burst',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
        radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
        radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
        radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
        #000000
      `,
    },
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Nebula',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147, 51, 234, 0.12), transparent 55%),
        radial-gradient(ellipse 130% 60% at 75% 15%, rgba(59, 130, 246, 0.10), transparent 65%),
        radial-gradient(ellipse 80% 90% at 20% 30%, rgba(236, 72, 153, 0.14), transparent 50%),
        radial-gradient(ellipse 100% 40% at 60% 70%, rgba(16, 185, 129, 0.08), transparent 45%),
        #000000
      `,
    },
  },
  {
    id: 'stellar-mist',
    name: 'Stellar Mist',
    category: 'gradients',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: `
        radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%),
        radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%),
        radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%),
        radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%),
        radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%),
        #000000
      `,
    },
  },
  {
    id: 'diagonal-striped-grid',
    name: 'Diagonal Striped Grid',
    category: 'geometric',
    badge: 'New',
    containerStyle,
    style: {
      ...positionStyle,
      background: '#ffffff',
      backgroundImage: `
        linear-gradient(90deg, rgba(16,185,129,0.25) 1px, transparent 0),
        linear-gradient(180deg, rgba(16,185,129,0.25) 1px, transparent 0),
        repeating-linear-gradient(45deg, rgba(16,185,129,0.2) 0 2px, transparent 2px 6px)
      `,
      backgroundSize: '24px 24px, 24px 24px, 24px 24px',
    },
  },
]
