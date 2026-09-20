import type { CodeStyleId, FrameworkId } from '../../../data/src/index'
import type { IndexedPattern } from '../index/pattern-index'
import { generatePatternCode } from '../../../data/src/index'
import { buildQuery, indexById, indexByName, PATTERN_INDEX, rankPatterns } from '../index/pattern-index'

export interface GetCodeArgs {
  id: string
  framework: FrameworkId
  style?: CodeStyleId
}

export interface Candidate {
  id: string
  name: string
  nameZh: string
}

export type Match = { kind: 'found', text: string }
  | { kind: 'ambiguous', candidates: Candidate[] }
  | { kind: 'not-found', suggestion: string }

/** How far ahead the leader must be before a keyword hit is served without asking. */
const AMBIGUITY_RATIO = 1.5

function render(entry: IndexedPattern, framework: FrameworkId, style: CodeStyleId): string {
  const files = generatePatternCode(entry.pattern, framework, style)
  const header = [
    `Backdrop: ${entry.name}${entry.nameZh ? ` (${entry.nameZh})` : ''}`,
    `Category: ${entry.category} · Framework: ${framework} · Style: ${style}`,
  ].join('\n')

  return [
    header,
    ...files.map(file => `\n--- ${file.filename} (${file.lang}) ---\n${file.code}`),
  ].join('')
}

/**
 * Exact id → exact name → keywords. A keyword search that lands on several looks returns
 * those candidates instead of guessing, because the caller has a user to ask.
 */
export function getBackdropCode(args: GetCodeArgs): Match {
  const wanted = args.id.trim()
  const style = args.style ?? 'inline'

  const exact = indexById(wanted) ?? indexByName(wanted)
  if (exact)
    return { kind: 'found', text: render(exact, args.framework, style) }

  const hits = rankPatterns(PATTERN_INDEX, buildQuery(wanted)).slice(0, 5)
  const [leader, runner] = hits

  if (!leader) {
    return {
      kind: 'not-found',
      suggestion: `"${wanted}" matched nothing. Call search_backdrops first and pass back an exact id.`,
    }
  }

  const decisive = !runner
    || (leader.coverage === 1 && leader.score >= runner.score * AMBIGUITY_RATIO)
  if (decisive)
    return { kind: 'found', text: render(leader.entry, args.framework, style) }

  return {
    kind: 'ambiguous',
    candidates: hits.map(hit => ({
      id: hit.entry.id,
      name: hit.entry.name,
      nameZh: hit.entry.nameZh,
    })),
  }
}
