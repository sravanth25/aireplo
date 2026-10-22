// Runs after `vite build` + the SSR build: writes one real HTML file per page with its own
// title, description and structured data, plus robots.txt, sitemap.xml, llms.txt and markdown copies.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist'
const server = await import(pathToFileURL(join(process.cwd(), 'dist-ssr', 'entry-server.js')).href)
const template = await readFile(join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) throw new Error('index.html is missing the prerender markers')

for (const route of server.routes) {
  // the private inbox is not pre-rendered (it needs the browser), only given its own noindex page
  const html = route.noindex ? '' : server.render(route.path)
  const page = template.replace('<!--app-head-->', server.headFor(route)).replace('<!--app-html-->', html)
  const out = join(dist, route.file)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, page)
  console.log(`  ${route.path.padEnd(38)} → ${route.file} (${Math.round(page.length / 1024)} kB)`)
}

const files = {
  'robots.txt': server.robotsTxt(),
  'sitemap.xml': server.sitemapXml(),
  'llms.txt': server.llmsTxt(),
  'llms-full.txt': server.llmsFullTxt(),
  'index.md': server.homeMd(),
  'partners.md': server.partnersMd(),
  'tools.md': server.toolsMd(),
}
for (const [name, body] of Object.entries(files)) {
  await writeFile(join(dist, name), body)
  console.log(`  ${name}`)
}
await rm('dist-ssr', { recursive: true, force: true })
