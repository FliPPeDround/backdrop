import type { Query, SearchHit } from '../index/pattern-index'
import { buildQuery, PATTERN_INDEX, rankPatterns } from '../index/pattern-index'
import { patternUrl } from '../site'

export const DEFAULT_LIMIT = 15
export const MAX_LIMIT = 40

export interface SearchArgs {
  query?: string
  category?: string
  limit?: number
  offset?: number
}

export interface SearchResult {
  id: string
  name: string
  nameZh: string
  category: string
  /** What the CSS and the palette prove: radial, mask, dark, blue… */
  tags: string[]
  /** Preview link, so a user can look at the pattern before committing to it. */
  url: string
  /** Query words this entry satisfied, so the ranking is auditable instead of a black box. */
  matched: string[]
}

export interface SearchOutput {
  /** Patterns matching the whole query — not the number returned. */
  total: number
  /** How many of the matches satisfied every query unit; the rest are partial. */
  fullMatches: number
  returned: number
  offset: number
  hasMore: boolean
  results: SearchResult[]
  /** Only present when the caller needs to know something; empty is the happy path. */
  hints: string[]
}

/** A query carrying nothing the index can act on would otherwise browse silently. */
function isHollow(query: Query): boolean {
  return query.groups.length === 0 && query.latin.length === 0 && query.categories.length === 0
}

function buildHints(hits: SearchHit[], query: Query, browsed: boolean): string[] {
  const hints: string[] = []

  if (query.unknown.length > 0)
    hints.push(`未收录的查询词：${query.unknown.join('、')}。排序只用了其余的词。`)

  if (hits.length > 0) {
    if (browsed)
      hints.push('没有给 query，这里是按库内顺序列出的部分图案。用 query 描述想要的背景。')
    return hints
  }

  hints.push(query.raw
    ? '没有匹配的图案。可以少给几个词，或者去掉 category。'
    : '这个分类下没有图案。去掉 category 再试。')
  return hints
}

export function searchPatterns(args: SearchArgs): SearchOutput {
  const limit = Math.min(Math.max(Math.trunc(args.limit ?? DEFAULT_LIMIT), 1), MAX_LIMIT)
  const offset = Math.max(Math.trunc(args.offset ?? 0), 0)
  const scoped = args.category
    ? PATTERN_INDEX.filter(entry => entry.category === args.category)
    : PATTERN_INDEX

  const query = buildQuery(args.query ?? '')
  const browsed = isHollow(query)
  const hits = browsed
    // Browsing without a description still has to stay bounded.
    ? scoped.map(entry => ({ entry, score: 0, coverage: 1, matched: [] }))
    : rankPatterns(scoped, query)
  const page = hits.slice(offset, offset + limit)

  return {
    total: hits.length,
    fullMatches: browsed ? 0 : hits.filter(hit => hit.coverage === 1).length,
    returned: page.length,
    offset,
    hasMore: offset + page.length < hits.length,
    hints: buildHints(hits, query, browsed),
    results: page.map(hit => ({
      id: hit.entry.id,
      name: hit.entry.name,
      nameZh: hit.entry.nameZh,
      category: hit.entry.category,
      tags: hit.entry.tags,
      url: patternUrl(hit.entry.id),
      matched: hit.matched,
    })),
  }
}
