import type { Pattern } from '../../../data/src/index'
import type { PatternFacets } from './facets'
import type { TermGroup } from './synonyms'
import { gridPatterns } from '../../../data/src/index'
import { computeEffectTags, computeFacets } from './facets'
import { PATTERN_META } from './pattern-meta'
import { expandQuery, matchCategories, TERM_GROUPS, tokenize } from './synonyms'

/**
 * Field weights. A query unit scores as the max over the fields it can hit, never the sum,
 * so an eight-word colour expansion cannot outscore a two-word structural phrase.
 */
const WEIGHT = {
  name: 6,
  nameZh: 5,
  keyword: 4,
  id: 4,
  description: 3,
  colourFacet: 3,
  qualityFacet: 2,
  category: 2,
} as const

/** Directional vocabulary, read back out of the term table so the two cannot drift. */
const POSITION_BY_TOKEN = new Map<string, string>()
for (const group of TERM_GROUPS) {
  for (const kind of group.at ?? []) {
    for (const token of group.en) POSITION_BY_TOKEN.set(token, kind)
  }
}

export interface IndexedPattern {
  id: string
  name: string
  nameZh: string
  category: Pattern['category']
  pattern: Pattern
  facets: PatternFacets
  /** Styles the CSS proves directly (radial, mask, animated…) plus colour/tone/mood tags. */
  tags: string[]
  nameTokens: Set<string>
  idTokens: Set<string>
  descriptionTokens: Set<string>
  keywords: Set<string>
  /** Directional kinds in the name, which separate `Grid Left` from `Grid Right`. */
  positions: Set<string>
}

/**
 * Ids, English names and Chinese names all funnel through this before lookup. Callers are
 * language models: they re-case, collapse spaces and swap `_`/`/` for `-` without meaning to,
 * and an identifier that only resolves byte-for-byte is an identifier they cannot use.
 */
export function normalizeLookup(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s_/]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function stem(token: string): string {
  if (token.length <= 3)
    return token
  if (token.endsWith('ies'))
    return `${token.slice(0, -3)}y`
  if (token.endsWith('ed') || token.endsWith('es'))
    return token.slice(0, -2)
  if (token.endsWith('s'))
    return token.slice(0, -1)
  return token
}

function stemmedSet(text: string): Set<string> {
  return new Set(tokenize(text).map(stem))
}

function indexPattern(pattern: Pattern): IndexedPattern {
  const meta = PATTERN_META[pattern.id]
  const tokens = tokenize(`${pattern.name} ${pattern.id}`)

  const facets = computeFacets(pattern)

  return {
    id: pattern.id,
    name: pattern.name,
    nameZh: meta?.nameZh ?? '',
    category: pattern.category,
    pattern,
    facets,
    tags: [...new Set([...computeEffectTags(pattern), ...facets.colours, facets.tone, facets.mood])].sort(),
    nameTokens: stemmedSet(pattern.name),
    idTokens: stemmedSet(pattern.id),
    descriptionTokens: stemmedSet(pattern.description ?? ''),
    keywords: new Set((meta?.keywords ?? []).flatMap(term => term ? [term.toLowerCase()] : [])),
    positions: new Set(tokens.flatMap((token) => {
      const kind = POSITION_BY_TOKEN.get(token)
      return kind ? [kind] : []
    })),
  }
}

export const PATTERN_INDEX: IndexedPattern[] = gridPatterns.map(indexPattern)

const BY_ID = new Map(PATTERN_INDEX.map(entry => [normalizeLookup(entry.id), entry]))
const BY_NAME = new Map(PATTERN_INDEX.map(entry => [normalizeLookup(entry.name), entry]))

const BY_NAME_ZH = new Map<string, IndexedPattern[]>()
for (const entry of PATTERN_INDEX) {
  const key = normalizeLookup(entry.nameZh)
  if (!key)
    continue
  const bucket = BY_NAME_ZH.get(key)
  if (bucket)
    bucket.push(entry)
  else BY_NAME_ZH.set(key, [entry])
}

export function indexById(id: string): IndexedPattern | undefined {
  return BY_ID.get(normalizeLookup(id))
}

export function indexByName(name: string): IndexedPattern | undefined {
  return BY_NAME.get(normalizeLookup(name))
}

/**
 * Chinese display names are composed from a shared term table rather than translated one by
 * one, so this stays plural: the generator disambiguates today, and a regression there must
 * degrade to "pick one" instead of silently serving the first of two identical-looking names.
 */
export function indexByNameZh(nameZh: string): IndexedPattern[] {
  return BY_NAME_ZH.get(normalizeLookup(nameZh)) ?? []
}

export interface Query {
  /** The text this was built from, kept so notes can quote it back. */
  raw: string
  groups: TermGroup[]
  /** Words that belong to no group; they still have to match a field directly. */
  latin: string[]
  positions: string[]
  /** Soft category signal — ranked, never filtered; see `CATEGORY_TERMS`. */
  categories: string[]
  /** Chinese words the term table has no entry for; surfaced so a client can rephrase. */
  unknown: string[]
}

export function buildQuery(text: string): Query {
  const { groups, latin, unknown } = expandQuery(text)
  const known = new Set(groups.flatMap(group => group.en))
  return {
    raw: text,
    groups,
    latin: latin.filter(token => !known.has(token)),
    positions: [...new Set(groups.flatMap(group => group.at ?? []))],
    categories: matchCategories(text),
    unknown,
  }
}

/** Weight of the strongest field this group hits, or 0 when it hits nothing. */
function groupWeight(group: TermGroup, entry: IndexedPattern): number {
  const english = group.en.map(stem)
  let best = 0

  if (english.some(token => entry.nameTokens.has(token)))
    best = Math.max(best, WEIGHT.name)
  if (group.zh.some(form => entry.nameZh.includes(form)))
    best = Math.max(best, WEIGHT.nameZh)
  if (group.zh.some(form => entry.keywords.has(form.toLowerCase()))
    || english.some(token => entry.keywords.has(token))) {
    best = Math.max(best, WEIGHT.keyword)
  }
  if (english.some(token => entry.idTokens.has(token)))
    best = Math.max(best, WEIGHT.id)
  if (english.some(token => entry.descriptionTokens.has(token)))
    best = Math.max(best, WEIGHT.description)
  if (group.facet?.kind === 'colour' && entry.facets.colours.includes(group.facet.value as HueValue))
    best = Math.max(best, WEIGHT.colourFacet)
  if (group.facet && group.facet.kind !== 'colour'
    && (entry.facets.tone === group.facet.value || entry.facets.mood === group.facet.value)) {
    best = Math.max(best, WEIGHT.qualityFacet)
  }

  return best
}

type HueValue = PatternFacets['colours'][number]

function tokenWeight(token: string, entry: IndexedPattern): number {
  const stemmed = stem(token)
  if (entry.nameTokens.has(stemmed))
    return WEIGHT.name
  if (entry.nameZh.includes(token))
    return WEIGHT.nameZh
  if (entry.keywords.has(stemmed) || entry.keywords.has(token))
    return WEIGHT.keyword
  if (entry.idTokens.has(stemmed))
    return WEIGHT.id
  if (entry.descriptionTokens.has(stemmed))
    return WEIGHT.description
  return 0
}

export interface SearchHit {
  entry: IndexedPattern
  score: number
  /**
   * Share of query units the pattern satisfied — ranking on this first is what surfaces a
   *  pattern matching both "soft" and "blue" above one matching only "blue" harder.
   */
  coverage: number
  /** The query units this pattern actually satisfied, so a caller can see why it came back. */
  matched: string[]
}

function scorePattern(entry: IndexedPattern, query: Query): SearchHit | undefined {
  const units: Array<{ label: string, weight: (entry: IndexedPattern) => number }> = [
    ...query.groups.map(group => ({
      label: group.zh[0] ?? group.en[0] ?? '',
      weight: (target: IndexedPattern) => groupWeight(group, target),
    })),
    ...query.latin.map(token => ({
      label: token,
      weight: (target: IndexedPattern) => tokenWeight(token, target),
    })),
  ]
  if (units.length === 0)
    return { entry, score: 0, coverage: 1, matched: [] }

  let score = 0
  let matched = 0
  const labels: string[] = []
  for (const unit of units) {
    const weight = unit.weight(entry)
    if (weight > 0) {
      matched++
      score += weight
      if (unit.label)
        labels.push(unit.label)
    }
  }
  if (matched === 0)
    return undefined

  // Category words like 渐变 nudge the order but must not gate it: plenty of the best
  // coloured gradients are filed under `effects`, so requiring a match would discard them.
  for (const category of query.categories) {
    if (entry.category === category)
      score += WEIGHT.category
  }

  // A pattern nobody asked a direction about should not be outranked by its own directional
  // siblings; conversely, when a direction is asked for, a pattern that states it is better
  // evidence than one that is merely silent about where it sits.
  if (query.positions.length === 0) {
    if (entry.positions.size > 0)
      score *= 0.9
  }
  else {
    const stated = [...entry.positions].filter(kind => query.positions.includes(kind)).length
    score *= stated === 0 ? 0.8 : 1 + 0.15 * (stated / query.positions.length)
  }

  return { entry, score, coverage: matched / units.length, matched: labels }
}

export function rankPatterns(entries: IndexedPattern[], query: Query): SearchHit[] {
  const hits: SearchHit[] = []

  for (const entry of entries) {
    const hit = scorePattern(entry, query)
    if (!hit)
      continue
    // The query names a direction, so siblings pointing elsewhere are wrong answers,
    // not lower-ranked ones.
    if (query.positions.length > 0
      && [...entry.positions].some(kind => !query.positions.includes(kind))) {
      continue
    }
    hits.push(hit)
  }

  // `id` last: residual ties among equal directional variants are not meaningful, but
  // they must at least be reproducible.
  return hits.sort((a, b) =>
    b.coverage - a.coverage
    || b.score - a.score
    || a.entry.positions.size - b.entry.positions.size
    || a.entry.nameTokens.size - b.entry.nameTokens.size
    || a.entry.id.localeCompare(b.entry.id))
}
