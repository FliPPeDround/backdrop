import type { McpServer } from '@modelcontextprotocol/server'
import { McpServer as McpServerImpl } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { getBackdropCode } from './tools/get-code'
import { searchBackdrops } from './tools/search'

const SERVER_INFO = {
  name: 'backdrop',
  version: '1.0.0',
}

const CATEGORY = z.enum(['gradients', 'geometric', 'decorative', 'effects'])
const FRAMEWORK = z.enum(['weixin', 'uniapp', 'taro', 'wevu'])
const STYLE = z.enum(['inline', 'separated', 'tailwind'])

const SEARCH_DESCRIPTION = `Searches a library of 258 CSS background patterns (gradients, glows, grids, masks) for mini-program and web pages. Returns at most \`limit\` compact hits — id, name, nameZh, category, never code. Call it first, then call get_backdrop_code for one id. \`query\` accepts English or Chinese: colours (blue, 蓝色), effects (glow, grid, dashed, noise, masked), directions (top, bottom, diagonal, 左上, center), mood (soft, dark, vivid); colours are also matched against each pattern's real CSS values, so '柔和的蓝色渐变' finds patterns named 'Azure Depths'. \`category\` narrows to gradients|geometric|decorative|effects. Do not request the whole library — refine the query instead. If hits are ambiguous or empty, ask the user which look they want or retry with different terms; never guess.`

const CODE_DESCRIPTION = `Returns complete ready-to-paste files for ONE pattern. \`id\` accepts the exact id from search_backdrops, an exact pattern name (case-insensitive), or keywords; keywords are fuzzy-resolved, and if several patterns match you get a candidate list instead of code, so prefer an exact id. \`framework\` picks syntax: weixin (WXML+WXSS), uniapp (Vue SFC), taro (TSX+SCSS), wevu (Vue SFC). \`style\` picks CSS delivery: inline (style attribute, the default), separated (markup file + stylesheet file), tailwind (arbitrary-value utilities). Framework and style change only the emitted syntax, never which pattern fits: choose those with search_backdrops.`

export function createServer(): McpServer {
  const server = new McpServerImpl(SERVER_INFO)

  server.registerTool(
    'search_backdrops',
    {
      title: 'Search backdrops',
      description: SEARCH_DESCRIPTION,
      inputSchema: z.object({
        query: z.string().max(120).optional().describe('English or Chinese description, e.g. "dashed grid", "柔和的蓝色渐变", "深色夜空".'),
        category: CATEGORY.optional()
          .describe('Restrict to one category. Applies after `query`; it is not a browse-by-nothing shortcut.'),
        limit: z.number().int().min(1).max(40).optional().describe('How many candidates to return. Defaults to 15.'),
      }),
    },
    async args => ({
      content: [{ type: 'text', text: JSON.stringify(searchBackdrops(args)) }],
    }),
  )

  server.registerTool(
    'get_backdrop_code',
    {
      title: 'Get backdrop code',
      description: CODE_DESCRIPTION,
      inputSchema: z.object({
        id: z.string().max(120).describe('Exact id from search_backdrops, a full pattern name, or keywords.'),
        framework: FRAMEWORK
          .describe('Target framework. Ask the user if they have not said.'),
        style: STYLE.optional()
          .describe('How CSS is delivered. Defaults to inline; use separated when the user wants a stylesheet.'),
      }),
    },
    async (args) => {
      const result = getBackdropCode(args)

      if (result.kind === 'found')
        return { content: [{ type: 'text', text: result.text }] }

      if (result.kind === 'ambiguous') {
        return {
          content: [{
            type: 'text',
            text: `"${args.id}" matches several backdrops, so no code was generated. Pick one of these ids, or ask the user which look they mean:\n${JSON.stringify(result.candidates)}`,
          }],
        }
      }

      return {
        content: [{ type: 'text', text: result.suggestion }],
        isError: true,
      }
    },
  )

  return server
}
