import assert from 'node:assert/strict'
import { generatePatternCode, gridPatterns, PATTERN_CODE_STYLES, PATTERN_FRAMEWORKS } from '@backdrop/data'
import { describe, it } from 'vitest'
import { computeFacets } from '../src/index/facets'
import { PATTERN_INDEX } from '../src/index/pattern-index'
import { PATTERN_META } from '../src/index/pattern-meta'

describe('pattern data', () => {
  it('indexes every pattern with a unique id', () => {
    assert.equal(PATTERN_INDEX.length, gridPatterns.length)
    assert.equal(new Set(PATTERN_INDEX.map(entry => entry.id)).size, gridPatterns.length)
  })

  it('gives every pattern a Chinese display name', () => {
    for (const pattern of gridPatterns) {
      const meta = PATTERN_META[pattern.id]
      assert.ok(meta, `missing meta for ${pattern.id}`)
      assert.match(meta.nameZh, /\p{Script=Han}/u, `${pattern.id} has no Chinese name`)
      assert.ok(meta.keywords.length >= 2, `${pattern.id} has no searchable keywords`)
    }
  })

  it('reads a colour out of nearly every pattern', () => {
    const colourless = gridPatterns.filter(pattern => computeFacets(pattern).colours.length === 0)
    assert.ok(colourless.length <= 5, `too many patterns without colour: ${colourless.map(p => p.id)}`)
  })
})

describe('generatePatternCode', () => {
  const frameworks = PATTERN_FRAMEWORKS.map(framework => framework.id)
  const styles = PATTERN_CODE_STYLES.map(style => style.id)

  it('emits the file set the UI expects, for every combination', () => {
    for (const pattern of gridPatterns) {
      for (const framework of frameworks) {
        for (const style of styles) {
          const files = generatePatternCode(pattern, framework, style)
          const label = `${pattern.id}/${framework}/${style}`

          assert.ok(files.length > 0, `${label}: no files`)
          assert.ok(files.every(file => file.code.trim().length > 0), `${label}: empty file`)

          // Only the frameworks with a separate stylesheet file split the output;
          // a Vue SFC carries its `<style>` block in the same document.
          const split = style === 'separated' && (framework === 'weixin' || framework === 'taro')
          assert.equal(files.length, split ? 2 : 1, `${label}: file count`)
          if (style === 'separated' && !split)
            assert.match(files[0]!.code, /<style/, `${label}: SFC lost its style block`)

          for (const file of files) {
            assert.match(file.filename, /\.(wxml|wxss|vue|tsx|scss)$/, `${label}: ${file.filename}`)
            assert.ok(['html', 'javascript', 'css'].includes(file.lang), `${label}: ${file.lang}`)
          }
        }
      }
    }
  })

  it('keeps a single response well inside a context budget', () => {
    let longest = 0
    for (const pattern of gridPatterns) {
      for (const framework of frameworks) {
        for (const style of styles) {
          const bytes = generatePatternCode(pattern, framework, style)
            .reduce((sum, file) => sum + file.code.length, 0)
          longest = Math.max(longest, bytes)
        }
      }
    }
    assert.ok(longest < 4000, `largest generated payload is ${longest} chars`)
  })
})
