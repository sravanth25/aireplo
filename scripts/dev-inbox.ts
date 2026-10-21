// Local demo of the team inbox: serves the built site + the inbox API with sample chats (memory store, fake AI and WhatsApp).
// Run: npm run build && npx tsx scripts/dev-inbox.ts  → http://localhost:4300/#inbox  (password: demo)
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

Object.assign(process.env, { INBOX_PASSWORD: 'demo', WHATSAPP_TOKEN: 'x', WHATSAPP_PHONE_NUMBER_ID: '1' })
delete process.env.DATABASE_URL
globalThis.fetch = (async () => new Response(JSON.stringify({ messages: [{ id: 'wamid.' + Math.random() }] }))) as typeof fetch
const inbox = await import('../api/inbox.ts')
const { store } = await import('../server/store.ts')

// sample conversations
const ago = (m: number) => new Date(Date.now() - m * 60000).toISOString()
async function chat(phone: string, name: string, lines: [string, string][], flags?: { botPaused?: boolean; needsHuman?: boolean }) {
  let i = 0
  for (const [who, text] of lines) {
    if (who === 'c') await store.saveInbound({ phone, name, waId: `${phone}-${i++}`, body: text })
    else await store.saveOutbound({ phone, sender: who === 'ai' ? 'ai' : 'agent', body: text })
  }
  if (flags) await store.setFlags(phone, flags)
}
await chat('919876543210', 'Ravi Kumar', [['c', 'Hi, what does Aireplo cost?'], ['ai', 'Hi Ravi! 😊 Packages start at *₹14,999 one-time*, no monthly subscription. What kind of business do you run?'], ['c', 'Clothing store, 2 outlets in Hyderabad'], ['ai', 'Nice! The *Growth* package (₹34,999) fits well: AI agent, Shopify integration and your own domain. Want a quick demo?']])
await chat('918888888888', 'Meera Iyer', [['c', 'Can I talk to a person please?'], ['ai', 'Of course! A team member will reply here shortly 🙌']], { needsHuman: true, botPaused: true })
await chat('917777777777', 'Arjun', [['c', 'Kya Hindi mein reply karta hai?'], ['ai', 'Haan ji! ✨ Hamara AI agent Hindi, English aur Hinglish mein reply karta hai.'], ['c', 'Great, I want the Pro package'], ['agent', 'Hi Arjun, this is Priya from Aireplo. I’ll call you in 10 minutes to get started!']], { botPaused: true })
for (const c of await store.contacts()) c.lastMessageAt = ago(c.phone === '918888888888' ? 2 : c.phone === '919876543210' ? 14 : 75)
await store.markRead('917777777777')

const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' }
createServer(async (req, res) => {
  const url = new URL(req.url!, 'http://localhost')
  if (url.pathname === '/api/inbox') {
    const chunks: Buffer[] = []
    for await (const c of req) chunks.push(c as Buffer)
    const r = new Request(url, { method: req.method, headers: req.headers as Record<string, string>, body: req.method === 'POST' ? Buffer.concat(chunks) : undefined })
    const out = await (req.method === 'POST' ? inbox.POST(r) : inbox.GET(r))
    res.writeHead(out.status, { 'content-type': 'application/json' })
    return res.end(await out.text())
  }
  const file = join('dist', url.pathname === '/' ? 'index.html' : url.pathname)
  try {
    const data = await readFile(file)
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404).end()
  }
}).listen(4300, () => console.log('inbox demo on http://localhost:4300/#inbox (password: demo)'))
