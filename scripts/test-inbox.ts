// Offline test of the WhatsApp webhook + team inbox with a fake Claude API and a fake WhatsApp API.
// Run: npm run test:inbox
import { createServer } from 'node:http'
import { createHmac } from 'node:crypto'
import type { AddressInfo } from 'node:net'

let aiCalls = 0
const fake = createServer((req, res) => {
  req.resume()
  req.on('end', () => {
    aiCalls++
    res.writeHead(200, { 'content-type': 'text/event-stream' })
    const ev = (type: string, data: object) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`)
    ev('message_start', { message: { id: 'm', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 1, output_tokens: 0 } } })
    ev('content_block_start', { index: 0, content_block: { type: 'text', text: '' } })
    ev('content_block_delta', { index: 0, delta: { type: 'text_delta', text: `AI reply ${aiCalls}` } })
    ev('content_block_stop', { index: 0 })
    ev('message_delta', { delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 3 } })
    ev('message_stop', {})
    res.end()
  })
})
await new Promise<void>((r) => fake.listen(0, r))
Object.assign(process.env, {
  ANTHROPIC_BASE_URL: `http://127.0.0.1:${(fake.address() as AddressInfo).port}`,
  ANTHROPIC_API_KEY: 'test',
  WHATSAPP_APP_SECRET: 'secret',
  WHATSAPP_TOKEN: 'tok',
  WHATSAPP_PHONE_NUMBER_ID: '999',
  INBOX_PASSWORD: 'open-sesame',
})
delete process.env.DATABASE_URL

const sentToWhatsApp: { to: string; text: string }[] = []
let waSeq = 0
const realFetch = globalThis.fetch
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input)
  if (url.startsWith('https://graph.facebook.com/')) {
    const b = JSON.parse(String(init?.body))
    if (b.type === 'text') sentToWhatsApp.push({ to: b.to, text: b.text.body })
    return new Response(JSON.stringify({ messages: [{ id: `wamid.out${++waSeq}` }] }), { status: 200 })
  }
  return realFetch(input, init)
}) as typeof fetch

const wa = await import('../api/whatsapp.ts')
const inbox = await import('../api/inbox.ts')
const { store } = await import('../server/store.ts')

let failed = 0
const check = (name: string, ok: boolean, detail?: unknown) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  → ' + JSON.stringify(detail)}`)
  if (!ok) failed++
}
const settle = () => new Promise((r) => setTimeout(r, 300))
let inSeq = 0
async function customerSays(text: string, from = '919876543210', name = 'Ravi') {
  const body = JSON.stringify({ entry: [{ changes: [{ value: { contacts: [{ profile: { name } }], messages: [{ from, id: `wamid.in${++inSeq}`, type: 'text', text: { body: text } }] } }] }] })
  const sig = 'sha256=' + createHmac('sha256', 'secret').update(body).digest('hex')
  await wa.POST(new Request('http://x/api/whatsapp', { method: 'POST', body, headers: { 'x-hub-signature-256': sig } }))
  await settle()
}
const call = async (query: string, body?: unknown, pw = 'open-sesame') => {
  const req = new Request(`http://x/api/inbox?${query}`, { method: body ? 'POST' : 'GET', headers: { authorization: `Bearer ${pw}` }, body: body ? JSON.stringify(body) : undefined })
  const res = await (body ? inbox.POST(req) : inbox.GET(req))
  return { status: res.status, data: await res.json() }
}

// auth
check('wrong password is rejected', (await call('action=contacts', undefined, 'nope')).status === 401)

// customer writes, AI answers, both saved
await customerSays('Hi, what does it cost?')
let r = await call('action=contacts')
const ravi = r.data.contacts?.[0]
check('chat appears in inbox with name and unread', r.status === 200 && ravi?.phone === '919876543210' && ravi?.name === 'Ravi' && ravi?.unread === 1, r.data)
r = await call('action=messages&phone=919876543210')
check('conversation shows customer + AI reply', r.data.messages?.map((m: { sender: string }) => m.sender).join(',') === 'customer,ai', r.data.messages)
check('customer can be replied to (24h window open)', r.data.contact?.canReply === true)
check('opening the chat marks it read', (await call('action=contacts')).data.contacts[0].unread === 0)

// AI keeps memory from the database
await customerSays('And for 3 numbers?')
const hist = await store.history('919876543210')
check('AI sees the earlier conversation', hist.length === 4 && hist[1].role === 'assistant', hist)

// team takes over by replying
const before = aiCalls
r = await call('action=send', { phone: '919876543210', text: 'Hi Ravi, this is Priya from the team 👋' })
check('team reply is sent to WhatsApp', r.status === 200 && sentToWhatsApp.at(-1)?.text.startsWith('Hi Ravi, this is Priya'), r.data)
check('replying pauses the AI for that chat', (await store.contact('919876543210'))?.botPaused === true)
await customerSays('Great, thanks Priya')
check('AI stays quiet while paused', aiCalls === before)
r = await call('action=messages&phone=919876543210')
check('message is still saved while paused', r.data.messages.at(-1)?.body === 'Great, thanks Priya' && r.data.messages.at(-2)?.sender === 'agent')

// resume the AI
await call('action=bot', { phone: '919876543210', paused: false })
await customerSays('One more question')
check('AI replies again after Resume', aiCalls === before + 1 && sentToWhatsApp.at(-1)?.text.startsWith('AI reply'))

// customer asks for a human
await customerSays('Can I talk to a person please?', '918888888888', 'Meera')
const meera = await store.contact('918888888888')
check('asking for a person flags the chat and pauses AI', meera?.needsHuman === true && meera?.botPaused === true, meera)
await customerSays('What can your AI agent do?', '917777777777', 'Arjun')
const arjun = await store.contact('917777777777')
check('“AI agent” question is not mistaken for a person request', arjun?.needsHuman === false && arjun?.botPaused === false, arjun)

// 24-hour window
const old = await store.contact('917777777777')
if (old) old.lastInboundAt = new Date(Date.now() - 25 * 3600 * 1000).toISOString()
r = await call('action=send', { phone: '917777777777', text: 'Hello?' })
check('reply blocked after 24 hours with a clear message', r.status === 409 && /24-hour/.test(r.data.error), r)

// duplicate delivery
const count = (await store.messages('919876543210')).length
const dupBody = JSON.stringify({ entry: [{ changes: [{ value: { messages: [{ from: '919876543210', id: 'wamid.in1', type: 'text', text: { body: 'Hi, what does it cost?' } }] } }] }] })
await wa.POST(new Request('http://x/api/whatsapp', { method: 'POST', body: dupBody, headers: { 'x-hub-signature-256': 'sha256=' + createHmac('sha256', 'secret').update(dupBody).digest('hex') } }))
await settle()
check('repeat delivery from Meta is not saved twice', (await store.messages('919876543210')).length === count)

fake.close()
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
