import type { CodeStyleId, FrameworkId, PatternCodeFile } from '../../../data/src/index'
import type { IndexedPattern } from '../index/pattern-index'
import { generatePatternCode, PATTERN_CODE_STYLES, PATTERN_FRAMEWORKS } from '../../../data/src/index'
import { indexById, indexByName, indexByNameZh } from '../index/pattern-index'
import { patternUrl } from '../site'

export interface GetCodeArgs {
  id: string
  framework?: FrameworkId
  style?: CodeStyleId
}

export interface Candidate {
  id: string
  name: string
  nameZh: string
}

export interface ResolvedPattern {
  id: string
  name: string
  nameZh: string
  url: string
}

export type Match
  = | {
    kind: 'found'
    pattern: ResolvedPattern
    framework: FrameworkId
    style: CodeStyleId
    files: PatternCodeFile[]
    text: string
  }
  | { kind: 'ambiguous', candidates: Candidate[] }
  | { kind: 'not-found', suggestion: string }

export const DEFAULT_FRAMEWORK: FrameworkId = 'weixin'
export const DEFAULT_STYLE: CodeStyleId = 'inline'

/** Framework ids and style ids are what the caller passes through; labels are what it means. */
export const FRAMEWORK_OPTIONS = PATTERN_FRAMEWORKS.map(option => option.id)
export const STYLE_OPTIONS = PATTERN_CODE_STYLES.map(option => option.id)

function render(entry: IndexedPattern, framework: FrameworkId, style: CodeStyleId, files: PatternCodeFile[]): string {
  const header = [
    `Backdrop: ${entry.name}${entry.nameZh ? ` (${entry.nameZh})` : ''}`,
    `Preview: ${patternUrl(entry.id)}`,
    `Category: ${entry.category} · Framework: ${framework} · Style: ${style}`,
  ].join('\n')

  return [
    header,
    ...files.map(file => `\n--- ${file.filename} (${file.lang}) ---\n${file.code}`),
  ].join('')
}

function found(entry: IndexedPattern, framework: FrameworkId, style: CodeStyleId): Match {
  const files = generatePatternCode(entry.pattern, framework, style)
  return {
    kind: 'found',
    pattern: { id: entry.id, name: entry.name, nameZh: entry.nameZh, url: patternUrl(entry.id) },
    framework,
    style,
    files,
    text: render(entry, framework, style, files),
  }
}

function candidatesOf(entries: IndexedPattern[]): Candidate[] {
  return entries.map(entry => ({
    id: entry.id,
    name: entry.name,
    nameZh: entry.nameZh,
  }))
}

/**
 * Exact id → exact English name → exact Chinese name. Nothing is guessed: a keyword or a
 * partial name is the job of `search_patterns`, and if a Chinese display name is shared the
 * caller gets the candidates rather than an arbitrary winner.
 */
export function getPatternCode(args: GetCodeArgs): Match {
  const wanted = args.id.trim()
  const style = args.style ?? DEFAULT_STYLE
  const framework = args.framework ?? DEFAULT_FRAMEWORK

  const exact = indexById(wanted) ?? indexByName(wanted)
  if (exact)
    return found(exact, framework, style)

  const byNameZh = indexByNameZh(wanted)
  if (byNameZh.length === 1)
    return found(byNameZh[0]!, framework, style)

  if (byNameZh.length > 1)
    return { kind: 'ambiguous', candidates: candidatesOf(byNameZh) }

  return {
    kind: 'not-found',
    suggestion: `"${wanted}" 不是已知的图案 id 或名称，没有生成代码。先调用 search_patterns，再把它返回的精确 id 传进来。`,
  }
}
