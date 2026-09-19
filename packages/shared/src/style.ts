import type { CSSProperties } from 'vue'

export type BindingStyle = Record<string, string | number>

const INSET_SIDES = ['top', 'right', 'bottom', 'left']

function toKebab(key: string) {
  return key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
}

/**
 * 两端把 camelCase 样式键序列化时都会丢掉 `WebkitMaskImage` 的前导短横线
 * （web 的 autoPrefix 只在逐属性 patch 路径生效，对象绑定走 hyphenate），
 * 所以在这里显式还原成合法的 `-webkit-*`。
 */
function toKey(key: string) {
  if (key.startsWith('--'))
    return key
  if (key.startsWith('Webkit'))
    return `-webkit-${toKebab(key.charAt(6).toLowerCase() + key.slice(7))}`
  return toKebab(key)
}

function toValue(value: string | number): string | number {
  if (typeof value !== 'string')
    return value
  return value.replace(/\s+/g, ' ').replace(/;+$/, '').trim()
}

export function toBindingStyle(style?: CSSProperties): BindingStyle {
  const out: BindingStyle = {}
  if (!style)
    return out

  for (const [rawKey, rawValue] of Object.entries(style)) {
    if (rawValue === undefined || rawValue === null)
      continue
    const value = toValue(rawValue as string | number)
    if (rawKey === 'inset') {
      // iOS < 14.5 与 Skyline 不认 inset，而它经由 patternLayerStyle 进了每一条图案
      for (const side of INSET_SIDES)
        out[side] = value
      continue
    }
    out[toKey(rawKey)] = value
  }

  return out
}
