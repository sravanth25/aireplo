// Makes one share image (1200×630) per page into public/og/, used when a page is shared on
// WhatsApp, LinkedIn, X or Slack. Run it after changing page headings, then commit the images:
//   node scripts/og-images.mjs
// Needs Playwright with a Chromium browser (not a project dependency, so Vercel doesn't install it).
import { execSync } from 'node:child_process'
import { mkdir, readFile, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  console.error('Playwright is not installed. Run: npm i -D --no-save playwright  (then run this script again)')
  process.exit(1)
}

const ssr = join('node_modules', '.og-ssr')
execSync(`npx vite build --ssr src/entry-server.tsx --outDir ${ssr} --logLevel error`, { stdio: 'inherit' })
const server = await import(pathToFileURL(join(process.cwd(), ssr, 'entry-server.js')).href)
const icon = await readFile('brand/icon.svg', 'utf8')
const { brand, packages, inr } = server
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const card = ({ eyebrow, heading }) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Inter:wght@500;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #07090c; font-family: Inter, sans-serif; color: #fff; position: relative; }
  .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 48px 48px; mask-image: radial-gradient(ellipse at 80% 0%, #000 20%, transparent 70%); }
  .glow { position: absolute; width: 900px; height: 600px; right: -260px; top: -320px; background: radial-gradient(closest-side, rgba(34,197,94,.30), transparent); }
  .wrap { position: absolute; inset: 64px 72px; display: flex; flex-direction: column; }
  .logo { display: flex; align-items: center; gap: 16px; font-family: 'Bricolage Grotesque'; font-weight: 800; font-size: 40px; letter-spacing: -0.03em; }
  .logo svg { width: 60px; height: 60px; }
  .pill { margin-top: 56px; align-self: flex-start; border: 1.5px solid rgba(34,197,94,.45); background: rgba(34,197,94,.12); color: #4ade80; font-weight: 600; font-size: 24px; padding: 8px 20px; border-radius: 999px; }
  h1 { margin-top: 24px; font-family: 'Bricolage Grotesque'; font-weight: 800; letter-spacing: -0.035em; line-height: 1.04; text-wrap: balance; max-width: 1000px; }
  .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 24px; color: rgba(255,255,255,.6); font-weight: 500; }
  .foot b { color: #fff; font-weight: 600; }
  .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: linear-gradient(90deg, #22c55e, #16a34a 60%, #0d9488); }
</style></head><body>
<div class="grid"></div><div class="glow"></div>
<div class="wrap">
  <div class="logo">${icon}<span>${esc(brand.name.toLowerCase())}</span></div>
  <div class="pill">${esc(eyebrow)}</div>
  <h1 id="h">${esc(heading)}</h1>
  <div class="foot"><span><b>One-time from ${inr(packages[0].price)}</b> · no monthly fee · you own it</span><span>${esc(brand.slogan)}</span></div>
</div>
<div class="bar"></div>
</body></html>`

await mkdir('public/og', { recursive: true })
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
let count = 0
for (const route of server.routes) {
  if (!route.card) continue
  await page.setContent(card(route.card), { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  // biggest heading size that leaves room above the footer line
  await page.evaluate(() => {
    const h = document.getElementById('h')
    for (let size = 84; size >= 48; size -= 2) {
      h.style.fontSize = size + 'px'
      if (h.offsetHeight <= 250) break
    }
  })
  const out = join('public', server.ogImagePath(route))
  await page.screenshot({ path: out })
  console.log(`  ${route.path.padEnd(48)} → ${out}`)
  count++
}
await browser.close()
await rm(ssr, { recursive: true, force: true })
console.log(`${count} share images made.`)
