import { createMcpHandler } from '@modelcontextprotocol/server'
import { createServer } from '../server'

/**
 * The only file that knows about the serving platform. `legacy: 'stateless'` keeps
 * 2025-era clients working; `responseMode: 'json'` keeps both tools single-response.
 */
export const handler = createMcpHandler(() => createServer(), {
  legacy: 'stateless',
  responseMode: 'json',
})
