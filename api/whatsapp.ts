import { waitUntil } from '@vercel/functions'
import { cleanHistory, getReply } from '../server/agent.js'
import { extractMessages, isFromMeta, markReadAndTyping, messageText, sendText } from '../server/whatsapp.js'
import { store, wantsHuman } from '../server/store.js'

// Webhook for Meta's WhatsApp Cloud API.
// In Meta Developer → WhatsApp → Configuration set:
//   Callback URL:  https://<your-domain>/api/whatsapp
//   Verify token:  the same value as the WHATSAPP_VERIFY_TOKEN env variable
// and subscribe to the "messages" field.

// Meta calls GET once to verify the webhook URL
export function GET(request: Request) {
  const url = new URL(request.url)
  const ok =
    url.searchParams.get('hub.mode') === 'subscribe' &&
    !!process.env.WHATSAPP_VERIFY_TOKEN &&
    url.searchParams.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN
  return ok ? new Response(url.searchParams.get('hub.challenge') ?? '', { status: 200 }) : new Response('Forbidden', { status: 403 })
}

// Quick in-instance guard against Meta delivering the same message twice at once
const seen = new Set<string>()

async function handle(from: string, messageId: string, text: string, name?: string) {
  // 1. Save the customer's message (the database also ignores repeats)
  const fresh = await store.saveInbound({ phone: from, name, waId: messageId, body: text })
  if (!fresh) return

  // 2. A person has taken over this chat: leave it for the team inbox
  const contact = await store.contact(from)
  if (contact?.botPaused) return

  // 3. AI reply, using the saved conversation as memory
  await markReadAndTyping(messageId)
  const turns = await store.history(from)
  if (name && turns.length === 1) turns[0] = { role: 'user', content: `(Customer name on WhatsApp: ${name})\n${text}` }
  let reply: string
  try {
    reply = await getReply(cleanHistory(turns))
  } catch (err) {
    console.error('AI reply failed', err)
    reply = 'Thanks for your message! Our team will reply shortly.'
  }
  const sent = await sendText(from, reply)
  await store.saveOutbound({ phone: from, sender: 'ai', body: reply, waId: sent.id })

  // 4. Customer asked for a person: flag the chat and pause the AI so the team can answer
  if (wantsHuman(text)) await store.setFlags(from, { needsHuman: true, botPaused: true })
}

// Meta calls POST for every incoming message. Answer 200 fast, then reply in the background.
export async function POST(request: Request) {
  const raw = await request.text()
  if (!isFromMeta(raw, request.headers.get('x-hub-signature-256'))) return new Response('Bad signature', { status: 401 })

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return new Response('ok')
  }
  for (const { msg, name } of extractMessages(body)) {
    if (seen.has(msg.id)) continue
    seen.add(msg.id)
    if (seen.size > 5000) seen.clear()
    const text = messageText(msg).trim()
    if (text) waitUntil(handle(msg.from, msg.id, text, name).catch((e) => console.error('webhook handle failed', e)))
  }
  return new Response('ok')
}
