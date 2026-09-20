import { handler } from '../src/transport/netlify'

// This route is the only way in: Netlify does not publish v2 functions at
// /.netlify/functions/mcp, and a redirect rule pointing there would outrank this route.
export const config = {
  path: ['/mcp'],
}

export default async (request: Request) => handler.fetch(request)
