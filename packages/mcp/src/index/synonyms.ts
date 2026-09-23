/**
 * Single source of truth for Chinese ↔ English search semantics.
 *
 * One table serves three directions, so they can never drift apart:
 *  1. query segmentation — `zh` surface forms are matched against Chinese input
 *  2. query expansion    — a matched group contributes its `en` tokens and, where the
 *                         group carries one, a tag matched against computed CSS facets
 *  3. meta generation    — `zh[0]` is the display term used to compose a pattern's Chinese name
 */

import type { PatternColor } from '../../../data/src/index'

export interface TermGroup {
  /** Chinese surface forms recognised in queries; `zh[0]` is the display form. */
  zh: string[]
  /** English tokens these forms expand to (matched against pattern name/id tokens). */
  en: string[]
  /**
   * Also match against values computed from the pattern's own CSS. Only colour/tone/mood
   * are computable; every other meaning rides on `en` tokens.
   */
  facet?: { kind: 'colour', value: PatternColor } | { kind: 'tone' | 'mood', value: string }
  /**
   * Directional kinds this group asks for — an array because 左上 names two.
   * Drives positional disambiguation at scoring time.
   */
  at?: string[]
}

export const TERM_GROUPS: TermGroup[] = [
  // ── colour families: `en` is the colour vocabulary actually present in the 258 names ──
  { zh: ['蓝', '蓝色', '湛蓝', '海蓝', '天蓝'], en: ['blue', 'azure', 'sky', 'ocean', 'navy', 'steel', 'marine', 'cyan'], facet: { kind: 'colour', value: 'blue' } },
  { zh: ['紫', '紫色', '堇紫'], en: ['violet', 'purple', 'indigo', 'orchid', 'lavender', 'magenta', 'lilac'], facet: { kind: 'colour', value: 'purple' } },
  { zh: ['青', '青色', '青绿', '薄荷'], en: ['teal', 'cyan', 'aquamarine', 'turquoise'], facet: { kind: 'colour', value: 'cyan' } },
  { zh: ['绿', '绿色', '翠绿', '森林绿'], en: ['green', 'emerald', 'lime', 'forest', 'sage', 'meadow'], facet: { kind: 'colour', value: 'green' } },
  { zh: ['黄', '黄色', '鹅黄'], en: ['yellow', 'gold', 'golden', 'sunny', 'mustard'], facet: { kind: 'colour', value: 'yellow' } },
  { zh: ['橙', '橙色', '橘色'], en: ['orange', 'apricot', 'peach', 'peachy', 'copper', 'carrot'], facet: { kind: 'colour', value: 'orange' } },
  { zh: ['红', '红色', '猩红', '酒红'], en: ['red', 'crimson', 'ruby', 'burgundy', 'scarlet'], facet: { kind: 'colour', value: 'red' } },
  { zh: ['粉', '粉色', '桃粉', '腮红'], en: ['pink', 'rose', 'blush', 'cherry', 'flamingo'], facet: { kind: 'colour', value: 'pink' } },
  { zh: ['棕', '棕色', '咖啡色', '大地色'], en: ['brown', 'beige', 'coffee', 'mocha', 'tan', 'bronze', 'wood'], facet: { kind: 'colour', value: 'brown' } },
  { zh: ['灰', '灰色', '单色', '黑白', '中性色'], en: ['gray', 'grey', 'slate', 'ash', 'charcoal', 'silver', 'pearl', 'black', 'white', 'cream', 'ivory'], facet: { kind: 'colour', value: 'monochrome' } },

  // ── tone: averaged lightness, so a dark pattern with no "dark" in its name still matches ──
  { zh: ['暗', '深色', '暗黑', '夜晚', '沉稳'], en: ['dark', 'darker', 'midnight', 'void', 'abyss', 'deep', 'noir'], facet: { kind: 'tone', value: 'dark' } },
  { zh: ['亮', '浅色', '明亮', '清浅'], en: ['light', 'bright', 'pale'], facet: { kind: 'tone', value: 'light' } },

  // ── mood: averaged saturation ──
  { zh: ['柔和', '淡雅', '低饱和', '温和', '清淡'], en: ['soft', 'subtle', 'pastel', 'mist', 'haze', 'fog', 'cotton', 'silk', 'whisper', 'whispers', 'gentle'], facet: { kind: 'mood', value: 'muted' } },
  { zh: ['鲜艳', '浓郁', '高饱和', '强烈', '亮眼'], en: ['vivid', 'electric', 'neon', 'bold', 'saturated', 'intense'], facet: { kind: 'mood', value: 'vivid' } },

  // ── structure vocabulary (name-token matching only) ──
  { zh: ['网格', '方格'], en: ['grid', 'grids', 'graph'] },
  { zh: ['圆点', '点阵', '波点'], en: ['dots', 'dot', 'dotted', 'polka', 'point'] },
  { zh: ['线条', '条纹'], en: ['lines', 'line', 'stripes', 'striped', 'vertical'] },
  { zh: ['虚线'], en: ['dashed', 'dash'] },
  { zh: ['棋盘格'], en: ['checker', 'checkerboard'] },
  { zh: ['交叉线', '十字'], en: ['cross', 'crosshatch'] },
  { zh: ['六边形', '蜂巢'], en: ['hexagon', 'hexagonal', 'honeycomb'] },
  { zh: ['三角形'], en: ['triangle', 'triangular'] },
  { zh: ['锯齿', '折线'], en: ['zigzag', 'chevron'] },
  { zh: ['同心圆'], en: ['concentric', 'rings', 'circle'] },
  { zh: ['方块'], en: ['squares', 'square'] },
  { zh: ['像素格'], en: ['pixel', 'pixelated'] },
  { zh: ['电路板'], en: ['circuit', 'board', 'matrix'] },
  { zh: ['迷宫'], en: ['maze', 'labyrinth'] },
  { zh: ['球体', '光球'], en: ['sphere', 'orb', 'ball'] },
  { zh: ['编织纹', '布纹'], en: ['woven', 'fabric', 'cloth', 'textile'] },
  { zh: ['多层', '双重'], en: ['dual', 'multi', 'quad', 'complex', 'variable', 'swapped'] },

  // ── effect vocabulary ──
  { zh: ['渐变'], en: ['gradient', 'gradients'] },
  { zh: ['径向渐变', '放射状'], en: ['radial'] },
  { zh: ['光晕', '发光', '柔光'], en: ['glow', 'glowing'] },
  { zh: ['聚光', '射灯'], en: ['spotlight', 'spot'] },
  { zh: ['淡出', '渐隐', '消隐'], en: ['fade', 'faded', 'less'] },
  { zh: ['蒙版', '遮罩'], en: ['masked', 'mask'] },
  { zh: ['噪点', '颗粒感'], en: ['noise', 'texture', 'grain'] },
  { zh: ['叠加'], en: ['overlay', 'multiplier'] },
  { zh: ['模糊'], en: ['blur', 'blurred', 'hazy'] },
  { zh: ['极光'], en: ['aurora', 'borealis'] },
  { zh: ['光斑', '绽放'], en: ['bloom', 'burst'] },
  { zh: ['星空', '宇宙感'], en: ['cosmic', 'cosmos', 'nebula', 'stellar', 'mystic', 'sparkle'] },
  { zh: ['流动', '动态'], en: ['flow', 'drift', 'animated'] },

  // ── position ──
  { zh: ['上方', '顶部', '从上', '上'], en: ['top', 'upper'], at: ['top'] },
  { zh: ['下方', '底部', '从下', '下'], en: ['bottom', 'lower'], at: ['bottom'] },
  { zh: ['左侧', '左边', '从左', '左'], en: ['left'], at: ['left'] },
  { zh: ['右侧', '右边', '从右', '右'], en: ['right'], at: ['right'] },
  { zh: ['居中', '中央', '中间'], en: ['center', 'middle', 'core'], at: ['center'] },
  { zh: ['对角', '斜向', '斜角'], en: ['diagonal', 'reverse'], at: ['diagonal'] },
  { zh: ['四角', '角落'], en: ['corner', 'corners'], at: ['corner'] },
  // Combined corners carry no single English token of their own; they exist so that
  // 左上 segments in one go and asks for both axes at once.
  { zh: ['左上', '左上角'], en: [], at: ['left', 'top'] },
  { zh: ['左下', '左下角'], en: [], at: ['left', 'bottom'] },
  { zh: ['右上', '右上角'], en: [], at: ['right', 'top'] },
  { zh: ['右下', '右下角'], en: [], at: ['right', 'bottom'] },

  // ── imagery: no CSS signal, but this is how people actually describe a look ──
  { zh: ['海滩', '沙滩'], en: ['beach', 'tropical', 'island'] },
  { zh: ['海洋', '海浪'], en: ['ocean', 'sea', 'wave', 'waves', 'tide'] },
  { zh: ['天空', '云朵'], en: ['sky', 'cloud', 'cloudy'] },
  { zh: ['日落', '黄昏'], en: ['sunset', 'dusk', 'twilight', 'evening'] },
  { zh: ['日出', '清晨'], en: ['sunrise', 'morning', 'dawn', 'spring'] },
  { zh: ['夜空', '月光'], en: ['midnight', 'moonlit', 'moonlight', 'northern'] },
  { zh: ['森林', '自然感'], en: ['forest', 'meadow', 'garden', 'breeze'] },
  { zh: ['糖果色', '甜美'], en: ['candy', 'sweet', 'dream', 'dreamy', 'harmony', 'fresh'] },
  { zh: ['金属感', '工业感'], en: ['steel', 'bronze', 'copper', 'forge', 'chrome', 'synth', 'synthwave'] },
  { zh: ['纸感', '织物感'], en: ['paper', 'linen', 'silk'] },
  { zh: ['风暴', '火山'], en: ['storm', 'volcanic', 'ember', 'ash'] },
  { zh: ['水晶', '宝石感'], en: ['crystal', 'prismatic', 'jewel', 'pearl'] },
  { zh: ['复古', '怀旧'], en: ['retro', 'vintage', 'art', 'decay'] },
  { zh: ['暖调', '冷调'], en: ['warm', 'cool'] },
]

/** Lower-cased English token → every group it belongs to (a token can be a colour and a material). */
export const EN_TO_GROUPS = new Map<string, TermGroup[]>()
/** Lower-cased English token → the Chinese display term used when composing names. */
export const EN_TO_ZH = new Map<string, string>()

for (const group of TERM_GROUPS) {
  for (const token of group.en) {
    const bucket = EN_TO_GROUPS.get(token)
    if (bucket)
      bucket.push(group)
    else EN_TO_GROUPS.set(token, [group])
    if (!EN_TO_ZH.has(token))
      EN_TO_ZH.set(token, group.zh[0]!)
  }
}

/**
 * Category vocabulary. These score as a soft signal rather than a filter: a great many
 * coloured gradients live in `effects`, so honouring 渐变 as a hard category constraint
 * would throw away the best matches instead of ranking them.
 */
export const CATEGORY_TERMS: Array<{ category: string, zh: string[], en: string[] }> = [
  { category: 'gradients', zh: ['渐变', '渐层'], en: ['gradient', 'gradients'] },
  { category: 'geometric', zh: ['几何', '图形'], en: ['geometric', 'shape', 'shapes'] },
  { category: 'decorative', zh: ['装饰', '花纹'], en: ['decorative', 'ornament'] },
  { category: 'effects', zh: ['效果', '光效'], en: ['effect', 'effects'] },
]

export function matchCategories(text: string): string[] {
  const lowered = text.toLowerCase()
  return CATEGORY_TERMS
    .filter(entry => entry.zh.some(term => lowered.includes(term))
      || entry.en.some(token => tokenize(lowered).includes(token)))
    .map(entry => entry.category)
}

/**
 * Words a query may legitimately contain without narrowing it: category labels (they score
 * through `matchCategories`, not as groups) and generic nouns that describe the whole
 * library. Recognising them keeps them out of the "not indexed" note.
 */
const NEUTRAL_FORMS = [
  ...CATEGORY_TERMS.flatMap(entry => entry.zh),
  '背景',
  '壁纸',
  '底图',
  '图案',
  '样式',
]

/** Group-less entries are consumed by segmentation but contribute no scoring unit. */
const ZH_LOOKUP: Array<[string, TermGroup | undefined]> = [
  ...TERM_GROUPS.flatMap(group => group.zh.map(form => [form, group] as [string, TermGroup | undefined])),
  ...NEUTRAL_FORMS.map(form => [form, undefined] as [string, TermGroup | undefined]),
]
  // Longest surface form first, so 蓝色 wins over 蓝 and 左上 wins over 左.
  .sort((a, b) => b[0].length - a[0].length)

export const STOP_TOKENS = new Set(['with', 'and', 'of', 'the', 'style'])

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length > 0 && !STOP_TOKENS.has(token))
}

/** Characters that carry no visual meaning on their own, so they never count as unknown. */
const CN_FILLER = /[的之一二三四五六七八九十点了很和与或请给我要来有个较比稍微就都也只更极是]/g

/**
 * Groups a Chinese query mentions, via longest-match segmentation over known surface
 * forms, plus the character runs nothing matched — reporting those is what lets a client
 * rephrase instead of trusting a silently narrowed query.
 */
export function segmentChinese(text: string): { groups: TermGroup[], unknown: string[] } {
  const found = new Set<TermGroup>()
  const unknown: string[] = []
  let skipped = ''
  const flush = () => {
    const cleaned = skipped.replace(CN_FILLER, '')
    if (cleaned.length >= 2)
      unknown.push(cleaned)
    skipped = ''
  }

  let index = 0
  while (index < text.length) {
    // ZH_LOOKUP is sorted longest-form-first, so 左上 wins over 左 at the same offset.
    const match = ZH_LOOKUP.find(([form]) => text.startsWith(form, index))
    if (match) {
      if (match[1])
        found.add(match[1])
      index += match[0].length
      flush()
      continue
    }
    skipped += text[index]
    index += 1
  }
  flush()
  return { groups: [...found], unknown }
}

/** Everything a query carries, in either language. */
export function expandQuery(text: string): { groups: TermGroup[], latin: string[], unknown: string[] } {
  const segmented = segmentChinese(text)
  const groups = new Set<TermGroup>(segmented.groups)
  const latin: string[] = []
  for (const token of tokenize(text)) {
    latin.push(token)
    for (const group of EN_TO_GROUPS.get(token) ?? []) groups.add(group)
  }
  return { groups: [...groups], latin, unknown: segmented.unknown }
}
