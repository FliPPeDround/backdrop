import { handler } from '../src/transport/netlify'

export const config = {
  path: ['/mcp'],
}

export default async (request: Request) => handler.fetch(request)
