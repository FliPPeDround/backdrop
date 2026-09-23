import assert from 'node:assert/strict'
import { generatePatternCode, gridPatterns, PATTERN_CODE_STYLES, PATTERN_COLOR_ORDER, PATTERN_FRAMEWORKS } from '@backdrop/data'
import { describe, it } from 'vitest'
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

  it('gives every pattern a Chinese name a caller can say back', () => {
    const seen = new Map<string, string>()
    for (const pattern of gridPatterns) {
      const { nameZh } = PATTERN_META[pattern.id]!
      const clash = seen.get(nameZh)
      assert.equal(clash, undefined, `${pattern.id} and ${clash} share the display name ${nameZh}`)
      seen.set(nameZh, pattern.id)
      assert.ok(nameZh.trim().length >= 2, `${pattern.id} has the one-character name ${nameZh}`)
    }
  })

  it('keeps category slugs out of the searchable keywords', () => {
    // Category is a filing label, not a description: matching it as content is what made
    // 「渐变」 return radial glows filed under `gradients`.
    for (const pattern of gridPatterns) {
      const keywords = PATTERN_META[pattern.id]!.keywords
      assert.ok(!keywords.includes(pattern.category), `${pattern.id} indexes its own category`)
    }
  })

  it('reads a colour out of nearly every pattern', () => {
    const colourless = gridPatterns.filter(pattern => pattern.color.length === 0)
    assert.ok(colourless.length <= 5, `too many patterns without colour: ${colourless.map(p => p.id)}`)
  })

  it('orders each pattern\'s colours by the shared hue order the filters list them in', () => {
    for (const pattern of gridPatterns) {
      const ranks = pattern.color.map(family => PATTERN_COLOR_ORDER.indexOf(family))
      const ascending = ranks.every((rank, index) => index === 0 || rank > ranks[index - 1]!)
      assert.ok(ascending, `${pattern.id} carries ${pattern.color.join('+')} out of hue order`)
    }
  })

  it('derives a tag list from the CSS, not from the name', () => {
    for (const entry of PATTERN_INDEX)
      assert.ok(entry.tags.length > 0, `${entry.id} has no tags`)
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

  it('defaults to the same style the UI and the tool default to', () => {
    const pattern = gridPatterns[0]!
    assert.deepEqual(
      generatePatternCode(pattern, 'weixin'),
      generatePatternCode(pattern, 'weixin', 'inline'),
    )
  })
})
