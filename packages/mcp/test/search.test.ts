import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { buildQuery, PATTERN_INDEX, rankPatterns } from '../src/index/pattern-index'
import { getBackdropCode } from '../src/tools/get-code'
import { MAX_LIMIT, searchBackdrops } from '../src/tools/search'

function topIds(query: string, limit = 5): string[] {
  return searchBackdrops({ query, limit }).results.map(result => result.id)
}

describe('search_backdrops', () => {
  it('answers a Chinese look request with the matching blue gradients first', () => {
    assert.equal(topIds('柔和的蓝色渐变')[0], 'soft-blue-radial')
    assert.ok(topIds('柔和的蓝色渐变').slice(0, 3).every(id => id.includes('blue') || id.includes('radial') || id.includes('gradient')))
  })

  it('finds a pattern whose own name never states its colour', () => {
    // `azure-depths` carries the colour only in its CSS values.
    assert.ok(topIds('蓝色', 20).includes('azure-depths'))
  })

  it('matches structural words in both languages', () => {
    assert.equal(topIds('虚线网格')[0], 'dashed-grid-light')
    assert.equal(topIds('dashed bottom left fade grid')[0], 'dashed-bottom-left-fade-grid')
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
    const output = searchBackdrops({ query: '柔和的糖果泡泡蓝' })
    assert.match(output.note ?? '', /糖果泡泡/)
  })

  it('stays quiet on words that carry no discriminating signal', () => {
    // 背景 describes the whole library and 效果 is a category label: both are recognised,
    // neither should be reported as unindexed.
    assert.equal(searchBackdrops({ query: '深色夜空感的背景' }).note, undefined)
    assert.equal(searchBackdrops({ query: '几何效果' }).note, undefined)
  })

  it('bounds the candidate list and never leaks code', () => {
    const output = searchBackdrops({ query: 'grid', limit: 9999 })
    assert.ok(output.results.length <= MAX_LIMIT)
    assert.equal(output.truncated, true)
    const json = JSON.stringify(searchBackdrops({ query: 'blue' }))
    assert.ok(!/background-image|radial-gradient|#\w{6}/.test(json), 'search payload contains CSS')
  })

  it('ranks deterministically across runs', () => {
    const first = topIds('深色网格', 10)
    const second = topIds('深色网格', 10)
    assert.deepEqual(first, second)
  })

  it('browses a category without pretending it searched', () => {
    const output = searchBackdrops({ category: 'gradients', limit: 3 })
    assert.equal(output.results.length, 3)
    assert.match(output.note ?? '', /No description given/)
    for (const result of output.results) assert.equal(result.category, 'gradients')
  })
})

describe('get_backdrop_code', () => {
  it('resolves an exact id', () => {
    const result = getBackdropCode({ id: 'soft-blue-radial', framework: 'taro', style: 'separated' })
    assert.equal(result.kind, 'found')
    if (result.kind === 'found') {
      assert.match(result.text, /--- index\.tsx/)
      assert.match(result.text, /--- index\.scss/)
    }
  })

  it('resolves a full English name case-insensitively', () => {
    const result = getBackdropCode({ id: 'dashed top left fade grid', framework: 'uniapp' })
    assert.equal(result.kind, 'found')
    if (result.kind === 'found')
      assert.match(result.text, /Dashed Top Left Fade Grid/)
  })

  it('returns candidates rather than guessing between close matches', () => {
    const result = getBackdropCode({ id: 'fade grid', framework: 'weixin' })
    assert.equal(result.kind, 'ambiguous')
    if (result.kind === 'ambiguous')
      assert.ok(result.candidates.length > 1)
  })

  it('says so when nothing matches at all', () => {
    const result = getBackdropCode({ id: 'zzzqqq', framework: 'weixin' })
    assert.equal(result.kind, 'not-found')
  })
})

describe('index integrity', () => {
  it('keeps every ranked entry resolvable by its own id', () => {
    for (const entry of PATTERN_INDEX) {
      const result = getBackdropCode({ id: entry.id, framework: 'weixin' })
      assert.equal(result.kind, 'found', entry.id)
    }
  })
})
