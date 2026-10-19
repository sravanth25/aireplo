import { waitUntil } from '@vercel/functions'
import { cleanHistory, getReply } from '../server/agent.js'
import { extractMessages, isFromMeta, markReadAndTyping, messageText, sendText } from '../server/whatsapp.js'
import { addTurns, firstTime, getHistory } from '../server/memory.js'

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

async function handle(from: string, messageId: string, text: string, name?: string) {
  await markReadAndTyping(messageId)
  const userTurn = { role: 'user' as const, content: name && getHistory(from).length === 0 ? `(Customer name on WhatsApp: ${name})\n${text}` : text }
  const history = cleanHistory([...getHistory(from), userTurn])
  try {
    const reply = await getReply(history)
    addTurns(from, userTurn, { role: 'assistant', content: reply })
    await sendText(from, reply)
  } catch (err) {
    console.error('AI reply failed', err)
    await sendText(from, 'Thanks for your message! Our team will reply shortly.')
  }
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
    if (!firstTime(msg.id)) continue
    const text = messageText(msg).trim()
    if (text) waitUntil(handle(msg.from, msg.id, text, name))
  }
  return new Response('ok')
}
