import type { CallToolResult, ListToolsResult } from '@modelcontextprotocol/server'
import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { handler } from '../src/transport/netlify'

/** The served wire format is SSE-framed JSON-RPC; tests speak to the real handler. */
async function rpc<T>(body: Record<string, unknown>): Promise<T> {
  const response = await handler.fetch(new Request('http://localhost/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'accept': 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', ...body }),
  }))
  assert.equal(response.status, 200)
  const text = await response.text()
  const payload = text.startsWith('event:')
    ? text.split('\n').filter(line => line.startsWith('data: ')).map(line => line.slice(6)).join('')
    : text
  return JSON.parse(payload)
}

function callTool(name: string, args: Record<string, unknown>) {
  return rpc<{ result: CallToolResult }>({
    id: 1,
    method: 'tools/call',
    params: { name, arguments: args },
  }).then(message => message.result)
}

describe('mcp server surface', () => {
  it('advertises two read-only tools and asks for nothing it can default', async () => {
    const { result } = await rpc<{ result: ListToolsResult }>({ id: 1, method: 'tools/list', params: {} })
    assert.deepEqual(result.tools.map(tool => tool.name), ['search_patterns', 'get_pattern_code'])

    for (const tool of result.tools) {
      assert.ok(tool.description && tool.description.length > 0, `${tool.name} has no description`)
      assert.equal(tool.annotations?.readOnlyHint, true)
      assert.ok(tool.outputSchema, `${tool.name} advertises no output schema`)
    }

    const get = result.tools.find(tool => tool.name === 'get_pattern_code')!
    assert.deepEqual(get.inputSchema.required, ['id'])
  })

  it('returns search results as text and as structured content', async () => {
    const result = await callTool('search_patterns', { query: '柔和的蓝色渐变', limit: 2 })

    assert.equal(result.isError, undefined)
    const structured = result.structuredContent as { total: number, results: Array<{ id: string, url: string }> }
    assert.ok(structured.total > 0)
    assert.equal(structured.results[0]?.id, 'soft-blue-radial')
    assert.match(structured.results[0]!.url, /^https:\/\/mpbackdrop\.netlify\.app\/\?pattern=/)

    const text = (result.content[0] as { text: string }).text
    assert.match(text, /soft-blue-radial/)
    assert.ok(!/background-image/.test(text), 'tool output leaked code')
  })

  it('returns code as files plus a readable text block', async () => {
    const result = await callTool('get_pattern_code', { id: 'soft-blue-radial', framework: 'uniapp', style: 'tailwind' })

    const structured = result.structuredContent as { status: string, files: Array<{ filename: string, code: string }> }
    assert.equal(structured.status, 'found')
    assert.deepEqual(structured.files.map(file => file.filename), ['index.vue'])
    assert.ok(structured.files[0]!.code.includes('<template>'))
  })

  it('reports an unusable argument as a result, not as a transport failure', async () => {
    const result = await callTool('get_pattern_code', { id: 'fade grid' })

    assert.equal(result.isError, undefined)
    assert.equal((result.structuredContent as { status: string }).status, 'not-found')
    assert.match((result.content[0] as { text: string }).text, /search_patterns/)
  })
})
