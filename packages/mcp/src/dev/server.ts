import type { IncomingMessage, ServerResponse } from 'node:http'
import { Buffer } from 'node:buffer'
import { createServer } from 'node:http'
import process from 'node:process'
import { handler } from '../transport/netlify'

const PORT = Number(process.env.PORT ?? 8788)

async function toRequest(req: IncomingMessage): Promise<Request> {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    for (const entry of Array.isArray(value) ? value : [value]) {
      if (entry !== undefined)
        headers.append(key, entry)
    }
  }

  const init: RequestInit = { method: req.method, headers }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(chunk as Buffer)
    init.body = Buffer.concat(chunks)
  }
  return new Request(new URL(req.url ?? '/', `http://localhost:${PORT}`), init)
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const response = await handler.fetch(await toRequest(req))
    res.statusCode = response.status
    response.headers.forEach((value, key) => {
      if (key !== 'content-length' && key !== 'transfer-encoding')
        res.setHeader(key, value)
    })
    res.end(Buffer.from(await response.arrayBuffer()))
  }
  catch (error) {
    res.statusCode = 500
    res.end(`mcp dev shim: ${String(error)}`)
  }
})

server.listen(PORT, () => {
  process.stdout.write(`backdrop mcp listening on http://localhost:${PORT}/mcp\n`)
})
