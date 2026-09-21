import type { McpServer } from '@modelcontextprotocol/server'
import { McpServer as McpServerImpl } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { PATTERN_INDEX } from './index/pattern-index'
import { DEFAULT_FRAMEWORK, DEFAULT_STYLE, FRAMEWORK_OPTIONS, getPatternCode, STYLE_OPTIONS } from './tools/get-code'
import { searchPatterns } from './tools/search'

const SERVER_INFO = {
  name: 'backdrop',
  version: '1.0.0',
}

const INSTRUCTIONS = `Backdrop 是一个纯 CSS 背景图案库（${PATTERN_INDEX.length} 个渐变、光晕、网格、遮罩等图案，不依赖图片），给小程序和 H5 页面用。常规流程：先用 search_patterns 用中文或英文描述想要的背景，从返回结果里挑一个 id，再用 get_pattern_code 取该 id 的代码。搜索结果不含代码，也不保证第一条就是用户要的：图案是视觉素材，把返回的 url 给用户看，或让用户在几个候选里选。`

const CATEGORY = z.enum(['gradients', 'geometric', 'decorative', 'effects'])
const FRAMEWORK = z.enum(['weixin', 'uniapp', 'taro', 'wevu'])
const STYLE = z.enum(['inline', 'separated', 'tailwind'])

const SEARCH_DESCRIPTION = `按描述搜索背景图案库，返回候选的 id、英文名、中文名、分类、标签、预览链接和命中词，不含代码。query 支持中文和英文：颜色（蓝色、blue）、效果（光晕、glow、网格、grid、噪点、noise）、方向（左上、top、diagonal）、调性（柔和、深色、鲜艳）。颜色还会与图案真实的 CSS 值比对，所以「柔和的蓝色渐变」能命中名字里没有 blue 的图案。category 把结果限制在 gradients|geometric|decorative|effects 之一；结果多时用 offset 翻页拿后面的。把选中的 id 交给 get_pattern_code 取代码。`

const CODE_DESCRIPTION = `取一个图案的完整可粘贴代码。id 用 search_patterns 返回的 id，或用完整的中文名 / 英文名；只做精确匹配（忽略大小写、空格和连字符），匹配不到会提示先搜索，不会猜一个近似图案。framework 决定语法：weixin=WXML+WXSS（默认），uniapp=Vue SFC，taro=TSX+SCSS，wevu=Vue SFC。style 决定 CSS 形式：inline=style 属性（默认），separated=标记文件加样式表，tailwind=任意值类名。framework 和 style 只改变输出语法，不改变图案本身。`

const fileSchema = z.object({
  filename: z.string(),
  lang: z.string(),
  code: z.string(),
})

const patternRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameZh: z.string(),
  url: z.string(),
})

/** One flat shape for every outcome, so `structuredContent` is always schema-valid. */
const getOutputSchema = z.object({
  status: z.enum(['found', 'ambiguous', 'not-found']),
  pattern: patternRefSchema.optional(),
  framework: z.string().optional(),
  style: z.string().optional(),
  files: z.array(fileSchema).optional(),
  candidates: z.array(patternRefSchema.pick({ id: true, name: true, nameZh: true })).optional(),
  message: z.string().optional(),
})

const searchOutputSchema = z.object({
  total: z.number(),
  fullMatches: z.number(),
  returned: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
  hints: z.array(z.string()),
  results: z.array(patternRefSchema.extend({
    category: z.string(),
    tags: z.array(z.string()),
    matched: z.array(z.string()),
  })),
})

export function createServer(): McpServer {
  const server = new McpServerImpl(SERVER_INFO, { instructions: INSTRUCTIONS })

  server.registerTool(
    'search_patterns',
    {
      title: '搜索背景图案',
      description: SEARCH_DESCRIPTION,
      inputSchema: z.object({
        query: z.string().max(120).optional().describe('中文或英文描述，例如 "dashed grid"、"柔和的蓝色渐变"、"深色夜空"。'),
        category: CATEGORY.optional()
          .describe('限定分类，作用于 query 之后；不带 query 时用它浏览该分类也可以。'),
        limit: z.number().int().min(1).max(40).optional().describe('返回条数，默认 15。'),
        offset: z.number().int().min(0).optional().describe('跳过前 N 条，用于 total 大于返回条数时翻页。'),
      }),
      outputSchema: searchOutputSchema,
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (args) => {
      const output = searchPatterns(args)
      const summary = searchSummary(output)
      return {
        content: [{ type: 'text', text: summary }],
        structuredContent: output,
      }
    },
  )

  server.registerTool(
    'get_pattern_code',
    {
      title: '获取图案代码',
      description: CODE_DESCRIPTION,
      inputSchema: z.object({
        id: z.string().max(120).describe('search_patterns 返回的 id，或完整的中文名 / 英文名。'),
        framework: FRAMEWORK
          .optional()
          .describe(`目标框架：${FRAMEWORK_OPTIONS.join(' | ')}，默认 ${DEFAULT_FRAMEWORK}。`),
        style: STYLE.optional()
          .describe(`CSS 形式：${STYLE_OPTIONS.join(' | ')}，默认 ${DEFAULT_STYLE}。用户要样式表时用 separated。`),
      }),
      outputSchema: getOutputSchema,
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (args) => {
      const result = getPatternCode(args)

      if (result.kind === 'found') {
        return {
          content: [{ type: 'text', text: result.text }],
          structuredContent: {
            status: 'found' as const,
            pattern: result.pattern,
            framework: result.framework,
            style: result.style,
            files: result.files,
          },
        }
      }

      if (result.kind === 'ambiguous') {
        const message = `"${args.id}" 对应多个图案，没有生成代码。让用户从下面选，或改用 id：${result.candidates.map(candidate => candidate.id).join('、')}`
        return {
          content: [{ type: 'text', text: `${message}\n${JSON.stringify(result.candidates, null, 2)}` }],
          structuredContent: {
            status: 'ambiguous' as const,
            candidates: result.candidates,
            message,
          },
        }
      }

      return {
        content: [{ type: 'text', text: result.suggestion }],
        structuredContent: {
          status: 'not-found' as const,
          message: result.suggestion,
        },
      }
    },
  )

  return server
}

/** Readable companion to `structuredContent`, for clients that only render text blocks. */
function searchSummary(output: ReturnType<typeof searchPatterns>): string {
  const lines = output.results.map((result, index) => {
    const matched = result.matched.length > 0 ? ` · 命中 ${result.matched.join('/')}` : ''
    return `${output.offset + index + 1}. ${result.name} · ${result.nameZh} · ${result.category} · ${result.id} · ${result.tags.join(',')}${matched}\n   ${result.url}`
  })
  const range = output.returned > 0
    ? `第 ${output.offset + 1}-${output.offset + output.returned} 条，共 ${output.total} 条`
    : '没有结果'
  const full = output.fullMatches > 0 ? `，其中 ${output.fullMatches} 个命中全部查询词` : ''
  return [
    `匹配 ${output.total} 个图案（${range}${full}）${output.hasMore ? '，还有更多结果，用 offset 翻页' : ''}`,
    ...lines,
    ...output.hints,
  ].join('\n')
}
