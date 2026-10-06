import type { HighlightTheme } from '@uni-helper/highlight/theme'
import { darkTheme } from '@uni-helper/highlight/theme'

/**
 * 代码块的配色。
 *
 * 代码不另起一层底色，就落在面板那块浅色内嵌玻璃上（见 uno.config 的 glass-inset，
 * 和分段控件的轨道是同一个面）。好处是整块面板只有一种玻璃，代码不像贴上去的；
 * 代价是这层玻璃是半透的，亮度会跟着背后的图案走 —— 实测最暗压在暗图案上是 #29282f，
 * 最亮压在亮图案上是 #535259，中间差了不到四倍，所以一套亮色 token 就够用：
 * 内容色在亮端 4.9–5.9:1、暗端 9 以上，标点与注释压在 3.6 左右当结构用（和页面 --ink-3 一个量级）。
 *
 * 色相还是 coal 那一族的紫灰，只是整体提到能在浅玻璃上读出来的亮度。
 */
export const codeTheme: HighlightTheme = {
  ...darkTheme,
  backgroundColor: 'transparent',
  foreground: '#e4e0eb',
  colors: {
    ...darkTheme.colors,
    keyword: '#dcc4fb',
    string: '#aadfc8',
    class: '#efd296',
    property: '#c1cef9',
    entity: '#f8c49f',
    jsxliterals: '#e4e0eb',
    /* CSS 里函数名（linear-gradient、rgba）和 transparent 这类值都落在 identifier 上，
       跟字符串同色，一整条声明才读得成一个整体 */
    identifier: '#aadfc8',
    sign: '#c3bdcb',
    comment: '#c6c0cd',
  },
}
