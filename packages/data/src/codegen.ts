import type { CSSProperties } from 'vue'
import type { Pattern } from './types/pattern'

export const PATTERN_FRAMEWORKS = [
  { id: 'weixin', label: '微信原生' },
  { id: 'uniapp', label: 'uni-app' },
  { id: 'taro', label: 'Taro' },
  { id: 'wevu', label: 'Wevu' },
] as const

export const PATTERN_CODE_STYLES = [
  { id: 'inline', label: '内联样式' },
  { id: 'separated', label: '样式分离' },
  { id: 'tailwind', label: 'Tailwind 类名' },
] as const

export type FrameworkId = (typeof PATTERN_FRAMEWORKS)[number]['id']
export type CodeStyleId = (typeof PATTERN_CODE_STYLES)[number]['id']
export type PatternCodeLang = 'html' | 'javascript' | 'css'

export interface PatternCodeFile {
  filename: string
  lang: PatternCodeLang
  code: string
}

const DEFAULT_CONTAINER: CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
}

const UNITLESS = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zoom',
])

function cssKey(key: string): string {
  if (key.startsWith('--'))
    return key
  return key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
}

function cssValue(key: string, value: string | number): string {
  if (typeof value === 'number') {
    if (UNITLESS.has(key) || value === 0)
      return String(value)
    return `${value}px`
  }
  return String(value).trim()
}

function styleEntries(style: CSSProperties = {}): [string, string | number][] {
  const out: [string, string | number][] = []
  for (const [key, raw] of Object.entries(style)) {
    if (raw === undefined || raw === null)
      continue
    const value = raw as string | number
    if (key === 'inset') {
      out.push(['top', value], ['right', value], ['bottom', value], ['left', value])
      continue
    }
    out.push([key, value])
  }
  return out
}

function styleToCss(style: CSSProperties | undefined, indent = '  '): string {
  return styleEntries(style).map(([key, value]) => {
    const rendered = cssValue(key, value)
    const body = rendered.includes('\n')
      ? rendered.split('\n').map((line, i) => i === 0 ? line : `${indent}${line}`).join('\n')
      : rendered
    return `${indent}${cssKey(key)}: ${body};`
  }).join('\n')
}

function styleToHtmlAttr(style: CSSProperties | undefined, indent: string): string {
  const css = styleToCss(style, `${indent}  `)
  if (!css)
    return 'style=""'
  return `style="\n${css}\n${indent}"`
}

function quoteJsString(value: string): string {
  if (value.includes('\n') || (value.includes('\'') && value.includes('"'))) {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')
    return `\`${escaped}\``
  }
  if (value.includes('\''))
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  return `'${value.replace(/\\/g, '\\\\')}'`
}

function styleToJsObject(style: CSSProperties | undefined, indent = '    '): string {
  const lines = styleEntries(style).map(([key, value]) => {
    const ident = /^[A-Z_$][\w$]*$/i.test(key) ? key : quoteJsString(key)
    const rendered = typeof value === 'number' ? String(value) : quoteJsString(String(value))
    return `${indent}${ident}: ${rendered},`
  })
  const closing = indent.slice(0, Math.max(0, indent.length - 2))
  return `{\n${lines.join('\n')}\n${closing}}`
}

function stylesheet(container: CSSProperties, layer: CSSProperties): string {
  return `.page {
${styleToCss(container)}
}

.page-bg {
${styleToCss(layer)}
}`
}

function collapseCssValue(value: string): string {
  return value
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim()
}

function toArbitraryValue(value: string): string {
  return collapseCssValue(value)
    .replace(/_/g, '\\_')
    .replace(/\s/g, '_')
}

function isSolidColor(value: string): boolean {
  return /^(?:#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\)|[a-z]+)$/i.test(
    collapseCssValue(value),
  )
}

function colorUtility(prefix: string, value: string): string {
  const v = collapseCssValue(value)
  switch (v.toLowerCase()) {
    case '#fff':
    case '#ffffff':
    case 'white':
      return `${prefix}-white`
    case '#000':
    case '#000000':
    case 'black':
      return `${prefix}-black`
    default:
      return `${prefix}-[${v}]`
  }
}

function arbitraryUtility(prefix: string, value: string): string {
  return `${prefix}-[${toArbitraryValue(value)}]`
}

function arbitraryProperty(cssProp: string, value: string | number): string {
  const rendered = typeof value === 'number' ? String(value) : toArbitraryValue(value)
  return `[${cssProp}:${rendered}]`
}

const POSITION_CLASS: Record<string, string> = {
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
  static: 'static',
}

const BG_REPEAT_CLASS: Record<string, string> = {
  'no-repeat': 'bg-no-repeat',
  'repeat': 'bg-repeat',
  'repeat-x': 'bg-repeat-x',
  'repeat-y': 'bg-repeat-y',
  'space': 'bg-repeat-space',
  'round': 'bg-repeat-round',
}

const BG_SIZE_CLASS: Record<string, string> = {
  auto: 'bg-auto',
  cover: 'bg-cover',
  contain: 'bg-contain',
}

const BG_POSITION_CLASS: Record<string, string> = {
  'center': 'bg-center',
  'top': 'bg-top',
  'bottom': 'bg-bottom',
  'left': 'bg-left',
  'right': 'bg-right',
  'left top': 'bg-left-top',
  'left bottom': 'bg-left-bottom',
  'right top': 'bg-right-top',
  'right bottom': 'bg-right-bottom',
}

const MIX_BLEND_CLASS: Record<string, string> = {
  'normal': 'mix-blend-normal',
  'multiply': 'mix-blend-multiply',
  'screen': 'mix-blend-screen',
  'overlay': 'mix-blend-overlay',
  'darken': 'mix-blend-darken',
  'lighten': 'mix-blend-lighten',
  'color-dodge': 'mix-blend-color-dodge',
  'color-burn': 'mix-blend-color-burn',
  'hard-light': 'mix-blend-hard-light',
  'soft-light': 'mix-blend-soft-light',
  'difference': 'mix-blend-difference',
  'exclusion': 'mix-blend-exclusion',
  'hue': 'mix-blend-hue',
  'saturation': 'mix-blend-saturation',
  'color': 'mix-blend-color',
  'luminosity': 'mix-blend-luminosity',
  'plus-lighter': 'mix-blend-plus-lighter',
}

const BG_BLEND_CLASS: Record<string, string> = Object.fromEntries(
  Object.entries(MIX_BLEND_CLASS).map(([key, value]) => [key, value.replace('mix-blend-', 'bg-blend-')]),
)

const MASK_COMPOSITE_CLASS: Record<string, string> = {
  add: 'mask-add',
  subtract: 'mask-subtract',
  intersect: 'mask-intersect',
  exclude: 'mask-exclude',
}

function opacityClass(value: string | number): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isNaN(n) && n >= 0 && n <= 1) {
    const pct = Math.round(n * 100)
    return `opacity-${pct}`
  }
  return arbitraryUtility('opacity', String(value))
}

function styleToTailwind(style: CSSProperties | undefined): string {
  if (!style)
    return ''

  const rawStyle = style as Record<string, unknown>
  const maskImage = rawStyle.maskImage == null ? '' : collapseCssValue(String(rawStyle.maskImage))
  const webkitMaskImage = rawStyle.WebkitMaskImage == null ? '' : collapseCssValue(String(rawStyle.WebkitMaskImage))
  const skipWebkitMask = Boolean(maskImage) && maskImage === webkitMaskImage
  const maskComposite = rawStyle.maskComposite == null ? '' : collapseCssValue(String(rawStyle.maskComposite))

  const classes: string[] = []
  for (const [key, raw] of Object.entries(style)) {
    if (raw === undefined || raw === null)
      continue
    const value = raw as string | number

    switch (key) {
      case 'position': {
        classes.push(POSITION_CLASS[String(value)] ?? arbitraryProperty('position', value))
        break
      }
      case 'inset': {
        if (value === 0 || value === '0' || value === '0px')
          classes.push('inset-0')
        else
          classes.push(arbitraryUtility('inset', cssValue(key, value)))
        break
      }
      case 'zIndex': {
        if (typeof value === 'number' && Number.isInteger(value))
          classes.push(`z-${value}`)
        else
          classes.push(arbitraryUtility('z', String(value)))
        break
      }
      case 'minHeight': {
        if (value === '100vh')
          classes.push('min-h-screen')
        else if (value === '100%')
          classes.push('min-h-full')
        else
          classes.push(arbitraryUtility('min-h', cssValue(key, value)))
        break
      }
      case 'width': {
        if (value === '100%')
          classes.push('w-full')
        else if (value === '100vw')
          classes.push('w-screen')
        else
          classes.push(arbitraryUtility('w', cssValue(key, value)))
        break
      }
      case 'height': {
        if (value === '100%')
          classes.push('h-full')
        else if (value === '100vh')
          classes.push('h-screen')
        else
          classes.push(arbitraryUtility('h', cssValue(key, value)))
        break
      }
      case 'opacity': {
        classes.push(opacityClass(value))
        break
      }
      case 'backgroundColor': {
        classes.push(colorUtility('bg', String(value)))
        break
      }
      case 'background': {
        const text = String(value)
        classes.push(isSolidColor(text) ? colorUtility('bg', text) : arbitraryProperty('background', text))
        break
      }
      case 'backgroundImage': {
        classes.push(`bg-[image:${toArbitraryValue(String(value))}]`)
        break
      }
      case 'backgroundSize': {
        const text = collapseCssValue(String(value))
        classes.push(BG_SIZE_CLASS[text] ?? `bg-[length:${toArbitraryValue(text)}]`)
        break
      }
      case 'backgroundPosition': {
        const text = collapseCssValue(String(value))
        classes.push(BG_POSITION_CLASS[text] ?? `bg-[position:${toArbitraryValue(text)}]`)
        break
      }
      case 'backgroundRepeat': {
        const text = collapseCssValue(String(value))
        classes.push(BG_REPEAT_CLASS[text] ?? arbitraryProperty('background-repeat', text))
        break
      }
      case 'backgroundBlendMode': {
        const text = collapseCssValue(String(value))
        classes.push(BG_BLEND_CLASS[text] ?? arbitraryProperty('background-blend-mode', text))
        break
      }
      case 'maskImage': {
        classes.push(arbitraryUtility('mask', String(value)))
        break
      }
      case 'WebkitMaskImage': {
        if (!skipWebkitMask)
          classes.push(arbitraryProperty('-webkit-mask-image', String(value)))
        break
      }
      case 'maskComposite': {
        classes.push(MASK_COMPOSITE_CLASS[maskComposite] ?? arbitraryProperty('mask-composite', maskComposite || String(value)))
        break
      }
      case 'WebkitMaskComposite': {
        const text = collapseCssValue(String(value))
        if (MASK_COMPOSITE_CLASS[maskComposite] && (text === 'source-in' || text === maskComposite))
          break
        classes.push(arbitraryProperty('-webkit-mask-composite', text))
        break
      }
      case 'filter': {
        classes.push(arbitraryProperty('filter', String(value)))
        break
      }
      case 'mixBlendMode': {
        const text = collapseCssValue(String(value))
        classes.push(MIX_BLEND_CLASS[text] ?? arbitraryProperty('mix-blend-mode', text))
        break
      }
      case 'boxShadow': {
        classes.push(arbitraryUtility('shadow', String(value)))
        break
      }
      case 'animation': {
        classes.push(arbitraryUtility('animate', String(value)))
        break
      }
      case 'imageRendering': {
        classes.push(arbitraryProperty('image-rendering', String(value)))
        break
      }
      default: {
        classes.push(arbitraryProperty(cssKey(key), typeof value === 'number' ? cssValue(key, value) : String(value)))
      }
    }
  }

  return classes.join(' ')
}

function classAttr(classes: string, indent: string, attr: 'class' | 'className' = 'class'): string {
  if (!classes)
    return `${attr}=""`
  if (classes.length <= 72)
    return `${attr}="${classes}"`
  return `${attr}="\n${indent}  ${classes}\n${indent}"`
}

function generateTailwind(pattern: Pattern, framework: FrameworkId): PatternCodeFile[] {
  const container = styleToTailwind(pattern.containerStyle ?? DEFAULT_CONTAINER)
  const layer = styleToTailwind(pattern.style)

  if (framework === 'taro') {
    return [{
      filename: 'index.tsx',
      lang: 'javascript',
      code: `import { View } from '@tarojs/components'

export default function Page() {
  return (
    <View ${classAttr(container, '    ', 'className')}>
      <View
        ${classAttr(layer, '        ', 'className')}
      />
      {/* 页面内容 */}
    </View>
  )
}`,
    }]
  }

  if (framework === 'weixin') {
    return [{
      filename: 'page.wxml',
      lang: 'html',
      code: `<view ${classAttr(container, '')}>
  <view ${classAttr(layer, '  ')}></view>
  <!-- 页面内容 -->
</view>`,
    }]
  }

  return [{
    filename: 'index.vue',
    lang: 'html',
    code: `<template>
  <view ${classAttr(container, '  ')}>
    <view ${classAttr(layer, '    ')} />
    <!-- 页面内容 -->
  </view>
</template>`,
  }]
}

function generateWeixin(pattern: Pattern, codeStyle: CodeStyleId): PatternCodeFile[] {
  const container = pattern.containerStyle ?? DEFAULT_CONTAINER
  if (codeStyle === 'inline') {
    return [{
      filename: 'page.wxml',
      lang: 'html',
      code: `<view ${styleToHtmlAttr(container, '')}>
  <view ${styleToHtmlAttr(pattern.style, '  ')}></view>
  <!-- 页面内容 -->
</view>`,
    }]
  }
  return [
    {
      filename: 'page.wxml',
      lang: 'html',
      code: `<view class="page">
  <view class="page-bg"></view>
  <!-- 页面内容 -->
</view>`,
    },
    {
      filename: 'page.wxss',
      lang: 'css',
      code: stylesheet(container, pattern.style),
    },
  ]
}

function generateUniApp(pattern: Pattern, codeStyle: CodeStyleId): PatternCodeFile[] {
  const container = pattern.containerStyle ?? DEFAULT_CONTAINER
  if (codeStyle === 'inline') {
    return [{
      filename: 'index.vue',
      lang: 'html',
      code: `<template>
  <view ${styleToHtmlAttr(container, '  ')}>
    <view ${styleToHtmlAttr(pattern.style, '    ')} />
    <!-- 页面内容 -->
  </view>
</template>`,
    }]
  }
  return [
    {
      filename: 'index.vue',
      lang: 'html',
      code: `<template>
  <view class="page">
    <view class="page-bg" />
    <!-- 页面内容 -->
  </view>
</template>

<style scoped>
${stylesheet(container, pattern.style)}
</style>`,
    },
  ]
}

function generateTaro(pattern: Pattern, codeStyle: CodeStyleId): PatternCodeFile[] {
  const container = pattern.containerStyle ?? DEFAULT_CONTAINER
  if (codeStyle === 'inline') {
    return [{
      filename: 'index.tsx',
      lang: 'javascript',
      code: `import { View } from '@tarojs/components'

export default function Page() {
  return (
    <View style={${styleToJsObject(container, '      ')}}>
      <View
        style={${styleToJsObject(pattern.style, '          ')}}
      />
      {/* 页面内容 */}
    </View>
  )
}`,
    }]
  }
  return [
    {
      filename: 'index.tsx',
      lang: 'javascript',
      code: `import { View } from '@tarojs/components'

export default function Page() {
  return (
    <View className="page">
      <View className="page-bg" />
      {/* 页面内容 */}
    </View>
  )
}`,
    },
    {
      filename: 'index.scss',
      lang: 'css',
      code: stylesheet(container, pattern.style),
    },
  ]
}

export function generatePatternCode(
  pattern: Pattern,
  framework: FrameworkId,
  codeStyle: CodeStyleId = 'separated',
): PatternCodeFile[] {
  if (codeStyle === 'tailwind')
    return generateTailwind(pattern, framework)

  switch (framework) {
    case 'weixin':
      return generateWeixin(pattern, codeStyle)
    case 'uniapp':
      return generateUniApp(pattern, codeStyle)
    case 'taro':
      return generateTaro(pattern, codeStyle)
    case 'wevu':
      return generateUniApp(pattern, codeStyle)
  }
}
