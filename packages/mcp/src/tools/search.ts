import type { Query, SearchHit } from '../index/pattern-index'
import { buildQuery, PATTERN_INDEX, rankPatterns } from '../index/pattern-index'

export const DEFAULT_LIMIT = 15
export const MAX_LIMIT = 40

export interface SearchArgs {
  query?: string
  category?: string
  limit?: number
}

export interface SearchOutput {
  count: number
  truncated: boolean
  note?: string
  results: Array<{ id: string, name: string, nameZh: string, category: string }>
}

/** A query carrying nothing the index can act on would otherwise browse silently. */
function isHollow(query: Query): boolean {
  return query.groups.length === 0 && query.latin.length === 0 && query.categories.length === 0
}

function buildNote(hits: SearchHit[], query: Query, browsed: boolean): string | undefined {
  const unknown = query.unknown.length > 0
    ? ` Not indexed as description(s): ${query.unknown.join(', ')}.`
    : ''

  if (hits.length > 0) {
    if (!browsed && !unknown)
      return undefined
    return browsed
      ? `No description given, so this lists the library in source order. Pass \`query\` to search it.${unknown}`
      : `Some words were not indexed, so the ranking used the rest.${unknown}`
  }

  return query.raw
    ? `No pattern matched.${unknown} Retry with fewer terms, or drop \`category\`.`
    : 'No pattern carries that category. Retry without `category`.'
}

export function searchBackdrops(args: SearchArgs): SearchOutput {
  const limit = Math.min(Math.max(Math.trunc(args.limit ?? DEFAULT_LIMIT), 1), MAX_LIMIT)
  const scoped = args.category
    ? PATTERN_INDEX.filter(entry => entry.category === args.category)
    : PATTERN_INDEX

  const query = buildQuery(args.query ?? '')
  const browsed = isHollow(query)
  const hits = browsed
    // Browsing without a description still has to stay bounded.
    ? scoped.map(entry => ({ entry, score: 0, coverage: 1 }))
    : rankPatterns(scoped, query)

  return {
    count: hits.length,
    truncated: hits.length > limit,
    note: buildNote(hits, query, browsed),
    results: hits.slice(0, limit).map(hit => ({
      id: hit.entry.id,
      name: hit.entry.name,
      nameZh: hit.entry.nameZh,
      category: hit.entry.category,
    })),
  }
}
