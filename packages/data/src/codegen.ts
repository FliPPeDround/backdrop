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
