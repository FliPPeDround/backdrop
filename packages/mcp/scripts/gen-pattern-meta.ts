import type { Pattern } from '@backdrop/data'
/**
 * Regenerate `src/index/pattern-meta.ts` after adding patterns to `@backdrop/data`:
 *
 *   pnpm --filter @backdrop/mcp run gen:meta
 *
 * Chinese names are composed from the shared term table, not hand-translated, so that table
 * stays the single source of truth. `NAME_OVERRIDES` is where composition gets a name wrong;
 * prefer fixing the term table when the mistake is systematic.
 */
import { writeFile } from 'node:fs/promises'
import { gridPatterns } from '@backdrop/data'
import { computeFacets } from '../src/index/facets'
import { EN_TO_ZH, TERM_GROUPS, tokenize } from '../src/index/synonyms'

/** Corrected Chinese display names, keyed by pattern id. */
const NAME_OVERRIDES: Record<string, string> = {
  beach: '海滩暮色',
}

/** Nouns that head a Chinese name and so must land last. */
const HEAD_TERMS = new Set([
  '网格',
  '圆点',
  '方块',
  '线条',
  '条纹',
  '棋盘格',
  '六边形',
  '三角形',
  '锯齿',
  '同心圆',
  '电路板',
  '迷宫',
  '球体',
  '编织纹',
  '像素格',
  '交叉线',
  '多层',
  '光球',
])

const FACET_ZH = new Map<string, string>()
for (const group of TERM_GROUPS) {
  if (group.facet)
    FACET_ZH.set(`${group.facet.kind}:${group.facet.value}`, group.zh[0]!)
}

/** Terms that render through `composePosition` instead of appearing as themselves. */
const POSITION_TERMS = new Set(
  TERM_GROUPS.filter(group => group.at?.length).map(group => group.zh[0]!),
)

/** Grouped by the CSS facet they stand for, so the name can be ordered 位置·质感·色·主体. */
function termsForKind(kind: 'tone' | 'mood' | 'colour'): Set<string> {
  return new Set(
    TERM_GROUPS.filter(group => group.facet?.kind === kind).map(group => group.zh[0]!),
  )
}

const TONE_TERMS = termsForKind('tone')
const MOOD_TERMS = termsForKind('mood')
const COLOUR_TERMS = termsForKind('colour')

/** `left` + `bottom` collapses to 左下, the way a Chinese name would say it. */
function composePosition(kinds: Set<string>): string {
  const horizontal = kinds.has('left') ? '左' : kinds.has('right') ? '右' : ''
  const vertical = kinds.has('top') ? '上' : kinds.has('bottom') ? '下' : ''
  const axis = horizontal && vertical
    ? `${horizontal}${vertical}`
    : horizontal
      ? `${horizontal}侧`
      : vertical === '上'
        ? '顶部'
        : vertical === '下'
          ? '底部'
          : kinds.has('center')
            ? '居中'
            : kinds.has('corner') ? '四角' : ''
  return `${kinds.has('diagonal') ? '斜向' : ''}${axis}`
}

/** Drop any term a retained longer term already contains, e.g. 渐变 inside 径向渐变. */
function dedupeContainment(terms: string[]): string[] {
  return terms.filter(term => !terms.some(other => other !== term && other.includes(term)))
}

function quote(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
}

function buildEntry(pattern: Pattern) {
  const facets = computeFacets(pattern)
  const tokens = new Set([...tokenize(pattern.name), ...tokenize(pattern.id)])

  const positionKinds = new Set<string>()
  const parts: string[] = []
  for (const token of tokens) {
    for (const group of TERM_GROUPS) {
      for (const kind of group.at ?? []) {
        if (group.en.includes(token))
          positionKinds.add(kind)
      }
    }
    const zh = EN_TO_ZH.get(token)
    if (zh && !parts.includes(zh))
      parts.push(zh)
  }

  const facetKeywordTerms = [
    ...pattern.color.map(colour => FACET_ZH.get(`colour:${colour}`)),
    FACET_ZH.get(`tone:${facets.tone}`),
    FACET_ZH.get(`mood:${facets.mood}`),
  ].filter((term): term is string => Boolean(term))

  const rest = parts.filter(part => !POSITION_TERMS.has(part))
  const quality = rest.filter(part => TONE_TERMS.has(part) || MOOD_TERMS.has(part))
  const namedColours = rest.filter(part => COLOUR_TERMS.has(part))
  const head = rest.filter(part => HEAD_TERMS.has(part))
  const other = rest.filter(part => !quality.includes(part) && !namedColours.includes(part) && !head.includes(part))

  // Colour that only the CSS reveals still earns a place in the name, but tone and mood
  // that only the CSS reveals do not: a pile of adjectives reads like a machine wrote it.
  const colours = dedupeContainment([
    ...namedColours,
    ...pattern.color
      .map(colour => FACET_ZH.get(`colour:${colour}`))
      .filter((term): term is string => Boolean(term) && !namedColours.includes(term!)),
  ]).slice(0, 2)

  const position = composePosition(positionKinds)
  const nameZh = NAME_OVERRIDES[pattern.id]
    ?? `${position}${dedupeContainment([...quality, ...colours, ...other, ...head]).join('')}`

  // Facet colours land in keywords too: that is what lets a Chinese query find a pattern
  // whose own name never mentions its colour. The category slug deliberately stays out:
  // it is a filing label, and letting it match as content made 「渐变」 hit every pattern
  // filed under `gradients`, radial glows included.
  const keywords = [...new Set([...rest, ...facetKeywordTerms, position, ...tokens])]
    .filter(Boolean)

  return { id: pattern.id, nameZh, keywords }
}

/**
 * A composed name of one character, or two patterns sharing the same composed name, is not
 * something a caller can round-trip: search returns it, and `get` cannot tell the two apart.
 * Distinguishing words come from the English name, which is where the difference actually is.
 */
function distinctiveWords(entry: { id: string, name: string }, siblings: Array<{ id: string, name: string }>): string {
  const words = (candidate: { id: string, name: string }) =>
    [...new Set([...tokenize(candidate.name), ...tokenize(candidate.id)])]
  const siblingTokens = new Set(siblings.flatMap(words))
  // Short leftovers are abbreviations like `bg`, not something a Chinese name should carry.
  const unique = words(entry).filter(token => token.length >= 3 && !siblingTokens.has(token))
  // Nothing left that the siblings do not also carry: the id is the only honest distinguisher.
  return unique.length > 0 ? unique.slice(0, 2).map(capitalize).join(' ') : entry.id
}

function capitalize(token: string): string {
  return token.charAt(0).toUpperCase() + token.slice(1)
}

function disambiguate(entries: Array<{ id: string, nameZh: string, keywords: string[] }>) {
  const byName = new Map<string, typeof entries>()
  for (const entry of entries) {
    const bucket = byName.get(entry.nameZh)
    if (bucket)
      bucket.push(entry)
    else byName.set(entry.nameZh, [entry])
  }

  return entries.map((entry) => {
    const siblings = byName.get(entry.nameZh) ?? [entry]
    const weak = [...entry.nameZh].length <= 1
    if (!weak && siblings.length === 1)
      return entry

    const pattern = gridPatterns.find(candidate => candidate.id === entry.id)!
    const others = siblings
      .filter(sibling => sibling.id !== entry.id)
      .map(sibling => gridPatterns.find(candidate => candidate.id === sibling.id)!)
    const suffix = others.length > 0
      ? distinctiveWords(pattern, others)
      : capitalize(tokenize(pattern.name)[0] ?? pattern.id)

    return { ...entry, nameZh: `${entry.nameZh} (${suffix})` }
  })
}

const entries = disambiguate(gridPatterns.map(buildEntry))

const file = `/**
 * Generated by scripts/gen-pattern-meta.ts — run \`pnpm gen:meta\` instead of editing.
 */

export interface PatternMeta {
  /** Composed Chinese display name. */
  nameZh: string
  /** Search terms: Chinese display terms, computed colour/tone/mood tags, English tokens, category. */
  keywords: string[]
}

export const PATTERN_META: Record<string, PatternMeta> = {
${entries.map(entry => `  ${quote(entry.id)}: { nameZh: ${quote(entry.nameZh)}, keywords: [${entry.keywords.map(quote).join(', ')}] },`).join('\n')}
}
`

await writeFile(new URL('../src/index/pattern-meta.ts', import.meta.url), file, 'utf8')
console.log(`wrote ${entries.length} entries`)
for (const entry of entries.slice(0, 14)) console.log(`${entry.id} → ${entry.nameZh}`)
