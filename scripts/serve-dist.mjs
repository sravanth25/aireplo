// Serves dist/ like Vercel does (clean URLs: /partners → partners.html). Run: node scripts/serve-dist.mjs [port]
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' }
const isFile = async (p) => (await stat(p).catch(() => null))?.isFile()
createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
  for (const c of [join('dist', path), join('dist', path + '.html'), join('dist', path, 'index.html')]) {
    if (await isFile(c)) {
      res.writeHead(200, { 'content-type': types[extname(c)] ?? 'application/octet-stream' })
      return res.end(await readFile(c))
    }
  }
  // like Vercel: unknown paths get dist/404.html with a 404 status
  res.writeHead(404, { 'content-type': types['.html'] }).end(await readFile(join('dist', '404.html')).catch(() => 'Not found'))
}).listen(Number(process.argv[2] ?? 4400), () => console.log('serving dist with clean URLs'))
