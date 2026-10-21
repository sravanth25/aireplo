// Local test for api/chat and api/whatsapp with a fake Claude API and a fake WhatsApp API.
// Run: npx tsx scripts/test-api.ts
import { createServer } from 'node:http'
import { createHmac } from 'node:crypto'
import type { AddressInfo } from 'node:net'

const captured: { anthropic: { headers: Record<string, unknown>; body: any }[]; graph: { url: string; body: any }[] } = { anthropic: [], graph: [] }

// Fake Anthropic Messages API that streams a fixed reply
const fake = createServer((req, res) => {
  let raw = ''
  req.on('data', (c) => (raw += c))
  req.on('end', () => {
    captured.anthropic.push({ headers: req.headers, body: JSON.parse(raw) })
    res.writeHead(200, { 'content-type': 'text/event-stream' })
    const ev = (type: string, data: object) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`)
    ev('message_start', { message: { id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 0 } } })
    ev('content_block_start', { index: 0, content_block: { type: 'text', text: '' } })
    for (const t of ['Plans start ', 'at ₹799/month.']) ev('content_block_delta', { index: 0, delta: { type: 'text_delta', text: t } })
    ev('content_block_stop', { index: 0 })
    ev('message_delta', { delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 8 } })
    ev('message_stop', {})
    res.end()
  })
})
await new Promise<void>((r) => fake.listen(0, r))
process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${(fake.address() as AddressInfo).port}`
process.env.ANTHROPIC_API_KEY = 'test-key'
process.env.WHATSAPP_VERIFY_TOKEN = 'verify-me'
process.env.WHATSAPP_APP_SECRET = 'app-secret'
process.env.WHATSAPP_TOKEN = 'wa-token'
process.env.WHATSAPP_PHONE_NUMBER_ID = '12345'

// Intercept calls to Meta's Graph API
const realFetch = globalThis.fetch
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input)
  if (url.startsWith('https://graph.facebook.com/')) {
    captured.graph.push({ url, body: JSON.parse(String(init?.body)) })
    return new Response('{}', { status: 200 })
  }
  return realFetch(input, init)
}) as typeof fetch

const chat = await import('../api/chat.ts')
const wa = await import('../api/whatsapp.ts')

let failed = 0
const check = (name: string, ok: boolean, detail?: unknown) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  → ' + JSON.stringify(detail)}`)
  if (!ok) failed++
}

// 1. Website chat streams the reply
const chatRes = await chat.POST(new Request('http://x/api/chat', { method: 'POST', body: JSON.stringify({ messages: [{ role: 'assistant', content: 'Hi!' }, { role: 'user', content: 'Price?' }] }) }))
const chatText = await chatRes.text()
check('chat streams reply', chatRes.status === 200 && chatText === 'Plans start at ₹799/month.', { status: chatRes.status, chatText })
const sent = captured.anthropic[0]
check('chat drops leading assistant turn', sent?.body.messages.length === 1 && sent.body.messages[0].role === 'user', sent?.body.messages)
check('uses claude-opus-5-5 with fallbacks', sent?.body.model === 'claude-opus-5-5' && sent.body.fallbacks === 'default' && String(sent.headers['anthropic-beta']).includes('server-side-fallback-2026-07-01'), { model: sent?.body.model, beta: sent?.headers['anthropic-beta'] })
check('system prompt has one-time prices', String(sent?.body.system).includes('₹14,999 one-time') && String(sent?.body.system).includes('₹24,999 one-time') && !String(sent?.body.system).includes('/month'))

// 2. Bad chat input
const bad = await chat.POST(new Request('http://x/api/chat', { method: 'POST', body: 'nope' }))
check('chat rejects bad JSON', bad.status === 400)

// 3. Webhook verification
const okVerify = wa.GET(new Request('http://x/api/whatsapp?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=42'))
check('webhook verify accepts right token', okVerify.status === 200 && (await okVerify.text()) === '42')
const badVerify = wa.GET(new Request('http://x/api/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=42'))
check('webhook verify rejects wrong token', badVerify.status === 403)

// 4. Incoming WhatsApp message → AI reply sent back
const payload = JSON.stringify({
  object: 'whatsapp_business_account',
  entry: [{ changes: [{ field: 'messages', value: { contacts: [{ profile: { name: 'Ravi' } }], messages: [{ from: '919876543210', id: 'wamid.1', type: 'text', text: { body: 'Hi, what does it cost?' } }] } }] }],
})
const sig = 'sha256=' + createHmac('sha256', 'app-secret').update(payload).digest('hex')
const post = (body: string, signature: string) => wa.POST(new Request('http://x/api/whatsapp', { method: 'POST', body, headers: { 'x-hub-signature-256': signature } }))

const bySig = await post(payload, 'sha256=' + '0'.repeat(64))
check('webhook rejects bad signature', bySig.status === 401)

const r1 = await post(payload, sig)
check('webhook answers 200 right away', r1.status === 200)
await new Promise((r) => setTimeout(r, 500))
const reply = captured.graph.find((g) => g.body.type === 'text')
check('marks message read + typing', captured.graph.some((g) => g.body.status === 'read' && g.body.message_id === 'wamid.1' && g.body.typing_indicator))
check('sends AI reply to customer', reply?.url.endsWith('/12345/messages') === true && reply?.body.to === '919876543210' && reply?.body.text.body === 'Plans start at ₹799/month.', reply)
const waReq = captured.anthropic[1]?.body
check('customer name passed to AI', String(waReq?.messages[0]?.content).includes('Ravi'), waReq?.messages)

// 5. Duplicate delivery is ignored
const before = captured.graph.length
await post(payload, sig)
await new Promise((r) => setTimeout(r, 300))
check('duplicate message ignored', captured.graph.length === before)

// 6. Second message keeps conversation memory
const payload2 = payload.replace('wamid.1', 'wamid.2').replace('Hi, what does it cost?', 'And yearly?')
await post(payload2, 'sha256=' + createHmac('sha256', 'app-secret').update(payload2).digest('hex'))
await new Promise((r) => setTimeout(r, 500))
const turns = captured.anthropic[2]?.body.messages
check('remembers earlier turns', turns?.length === 3 && turns[1].role === 'assistant', turns)

fake.close()
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
