import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { buildQuery, normalizeLookup, PATTERN_INDEX, rankPatterns } from '../src/index/pattern-index'
import { getPatternCode } from '../src/tools/get-code'
import { MAX_LIMIT, searchPatterns } from '../src/tools/search'

function topIds(query: string, limit = 5): string[] {
  return searchPatterns({ query, limit }).results.map(result => result.id)
}

describe('search_patterns', () => {
  it('answers a Chinese look request with the matching blue gradients first', () => {
    const output = searchPatterns({ query: '柔和的蓝色渐变' })
    assert.equal(output.results[0]?.id, 'soft-blue-radial')
    assert.deepEqual(output.results[0]?.matched, ['柔和', '蓝', '渐变'])
    assert.ok(output.fullMatches > 0, 'no result satisfied every query word')
  })

  it('finds a pattern whose own name never states its colour', () => {
    // `azure-depths` carries the colour only in its CSS values.
    assert.ok(topIds('蓝色', 20).includes('azure-depths'))
  })

  it('matches structural words in both languages', () => {
    assert.equal(topIds('虚线网格')[0], 'dashed-grid-light')
    assert.equal(topIds('dashed bottom left fade grid')[0], 'dashed-bottom-left-fade-grid')
  })

  it('never ranks a pattern above the one that actually matches the direction', () => {
    // Regression: the category slug `gradients` used to count as content, so 「斜向渐变」
    // returned radial glows whose name never mentions a gradient or a direction.
    const output = searchPatterns({ query: '斜向渐变' })
    assert.equal(output.results[0]?.id, 'diagonal-lines')
    for (const result of output.results.slice(0, 5))
      assert.match(result.name.toLowerCase(), /diagonal/)
  })

  it('treats a stated direction as a requirement, not a hint', () => {
    const hits = rankPatterns(PATTERN_INDEX, buildQuery('左上淡出的网格'))
    assert.equal(hits[0]?.entry.id, 'dashed-top-left-fade-grid')
    for (const hit of hits) {
      for (const kind of hit.entry.positions)
        assert.ok(['left', 'top'].includes(kind), `${hit.entry.id} points ${kind}`)
    }
  })

  it('reports words it could not index instead of quietly narrowing the query', () => {
    const output = searchPatterns({ query: '柔和的糖果泡泡蓝' })
    assert.ok(output.hints.some(hint => hint.includes('糖果泡泡')), output.hints.join('|'))
  })

  it('stays quiet on words that carry no discriminating signal', () => {
    // 背景 describes the whole library and 效果 is a category label: both are recognised,
    // neither should be reported as unindexed.
    assert.deepEqual(searchPatterns({ query: '深色夜空感的背景' }).hints, [])
    assert.deepEqual(searchPatterns({ query: '几何效果' }).hints, [])
  })

  it('bounds the candidate list and never leaks code', () => {
    const output = searchPatterns({ query: 'grid', limit: 9999 })
    assert.ok(output.results.length <= MAX_LIMIT)
    assert.equal(output.hasMore, true)
    const json = JSON.stringify(searchPatterns({ query: 'blue' }))
    assert.ok(!/background-image|radial-gradient|#\w{6}/.test(json), 'search payload contains CSS')
  })

  it('pages through a result set instead of forcing a narrower query', () => {
    const first = searchPatterns({ query: 'grid', limit: 5 })
    const second = searchPatterns({ query: 'grid', limit: 5, offset: 5 })
    assert.equal(first.total, second.total)
    assert.equal(second.offset, 5)
    assert.equal(second.returned, 5)
    const overlap = first.results.filter(hit => second.results.some(next => next.id === hit.id))
    assert.deepEqual(overlap, [])
    const last = searchPatterns({ query: 'grid', limit: 5, offset: first.total - 2 })
    assert.equal(last.hasMore, false)
  })

  it('carries a preview link, tags and matched words on every hit', () => {
    const output = searchPatterns({ query: '深色网格' })
    assert.ok(output.results.length > 0)
    for (const result of output.results) {
      assert.equal(result.url, `https://mpbackdrop.netlify.app/?pattern=${encodeURIComponent(result.id)}`)
      assert.ok(result.tags.length > 0, `${result.id} has no tags`)
      assert.ok(result.matched.length > 0, `${result.id} does not say why it matched`)
    }
  })

  it('ranks deterministically across runs', () => {
    const first = topIds('深色网格', 10)
    const second = topIds('深色网格', 10)
    assert.deepEqual(first, second)
  })

  it('browses a category without pretending it searched', () => {
    const output = searchPatterns({ category: 'gradients', limit: 3 })
    assert.equal(output.results.length, 3)
    assert.equal(output.total, PATTERN_INDEX.filter(entry => entry.category === 'gradients').length)
    assert.ok(output.hints.some(hint => hint.includes('query')))
    assert.equal(output.fullMatches, 0)
    for (const result of output.results) assert.equal(result.category, 'gradients')
  })

  it('says what to try next when nothing matches', () => {
    const output = searchPatterns({ query: 'zzzz' })
    assert.equal(output.total, 0)
    assert.equal(output.returned, 0)
    assert.equal(output.hasMore, false)
    assert.ok(output.hints.some(hint => hint.includes('没有匹配')))
  })
})

describe('get_pattern_code', () => {
  it('resolves an exact id and splits the file set the way the framework needs', () => {
    const result = getPatternCode({ id: 'soft-blue-radial', framework: 'taro', style: 'separated' })
    assert.equal(result.kind, 'found')
    if (result.kind !== 'found')
      return
    assert.deepEqual(result.files.map(file => file.filename), ['index.tsx', 'index.scss'])
    assert.deepEqual(result.files.map(file => file.lang), ['javascript', 'css'])
    assert.match(result.text, /--- index\.tsx/)
    assert.match(result.text, /Preview: https:\/\/mpbackdrop\.netlify\.app\/\?pattern=soft-blue-radial/)
  })

  it('accepts ids and names however a model re-cases or re-spaces them', () => {
    for (const id of ['Orchid  Depths', 'orchid_depths', 'orchid-depths', 'DIAGONAL-FADE-BOTTOM-GRID-LEFT']) {
      const result = getPatternCode({ id })
      assert.equal(result.kind, 'found', id)
    }
  })

  it('accepts the Chinese display name that search returned', () => {
    const hit = searchPatterns({ query: '蓝', limit: 1 }).results[0]!
    const result = getPatternCode({ id: hit.nameZh })
    assert.equal(result.kind, 'found')
    if (result.kind === 'found')
      assert.equal(result.pattern.id, hit.id)
  })

  it('defaults to the site defaults instead of stopping to ask', () => {
    const result = getPatternCode({ id: 'soft-blue-radial' })
    assert.equal(result.kind, 'found')
    if (result.kind === 'found') {
      assert.equal(result.framework, 'weixin')
      assert.equal(result.style, 'inline')
      assert.deepEqual(result.files.map(file => file.filename), ['page.wxml'])
    }
  })

  it('refuses to guess when the argument is a description rather than an identifier', () => {
    // Keyword resolution is search_patterns' job; guessing here is how a caller ends up
    // pasting the code of a pattern nobody asked for.
    for (const id of ['fade grid', 'blue', '柔和的蓝色渐变']) {
      const result = getPatternCode({ id })
      assert.equal(result.kind, 'not-found', id)
      if (result.kind === 'not-found')
        assert.match(result.suggestion, /search_patterns/)
    }
  })
})

describe('index integrity', () => {
  it('keeps every ranked entry resolvable by its own id', () => {
    for (const entry of PATTERN_INDEX) {
      const result = getPatternCode({ id: entry.id })
      assert.equal(result.kind, 'found', entry.id)
    }
  })

  it('keeps ids slug-shaped so they survive urls, filenames and copy-paste', () => {
    for (const entry of PATTERN_INDEX)
      assert.match(entry.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, entry.id)
  })

  it('resolves ids, names and Chinese names without collisions', () => {
    // Two ids that normalise to the same string would make one pattern unreachable.
    const byId = new Map(PATTERN_INDEX.map(entry => [normalizeLookup(entry.id), entry.id]))
    assert.equal(byId.size, PATTERN_INDEX.length)
    const byName = new Map(PATTERN_INDEX.map(entry => [normalizeLookup(entry.name), entry.id]))
    assert.equal(byName.size, PATTERN_INDEX.length)
    const byNameZh = new Map(PATTERN_INDEX.map(entry => [normalizeLookup(entry.nameZh), entry.id]))
    assert.equal(byNameZh.size, PATTERN_INDEX.length)
  })
})
