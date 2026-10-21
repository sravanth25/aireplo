import { createHash, timingSafeEqual } from 'node:crypto'
import { canReply, hasDatabase, store } from '../server/store.js'
import { sendText } from '../server/whatsapp.js'

// Team inbox API (password-protected with INBOX_PASSWORD).
//   GET  /api/inbox?action=contacts              → all chats
//   GET  /api/inbox?action=messages&phone=…      → one chat (marks it read)
//   POST /api/inbox?action=send   {phone, text}  → reply from your WhatsApp number (pauses the AI for that chat)
//   POST /api/inbox?action=bot    {phone, paused} → pause or resume the AI for a chat

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

const digest = (s: string) => createHash('sha256').update(s).digest()

async function authorize(request: Request): Promise<Response | null> {
  const password = process.env.INBOX_PASSWORD
  if (!password) return json({ error: 'The inbox is not set up yet. Add INBOX_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.' }, 503)
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!given || !timingSafeEqual(digest(given), digest(password))) {
    await new Promise((r) => setTimeout(r, 600)) // slow down password guessing
    return json({ error: 'Wrong password.' }, 401)
  }
  // without a database the inbox would be empty after every restart (allowed only in local tests)
  if (!hasDatabase && process.env.NODE_ENV === 'production') return json({ error: 'No database connected. Add a Neon database in Vercel → Storage.' }, 503)
  return null
}

const cleanPhone = (p: unknown) => (typeof p === 'string' ? p.replace(/\D/g, '') : '')

export async function GET(request: Request) {
  const denied = await authorize(request)
  if (denied) return denied
  const url = new URL(request.url)
  const action = url.searchParams.get('action')
  if (action === 'contacts') return json({ contacts: await store.contacts() })
  if (action === 'messages') {
    const phone = cleanPhone(url.searchParams.get('phone'))
    if (!phone) return json({ error: 'Missing phone.' }, 400)
    const [contact, messages] = await Promise.all([store.contact(phone), store.messages(phone)])
    await store.markRead(phone)
    return json({ contact: contact && { ...contact, unread: 0, canReply: canReply(contact) }, messages })
  }
  return json({ error: 'Unknown action.' }, 400)
}

export async function POST(request: Request) {
  const denied = await authorize(request)
  if (denied) return denied
  const action = new URL(request.url).searchParams.get('action')
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Send JSON.' }, 400)
  }
  const phone = cleanPhone(body.phone)
  if (!phone) return json({ error: 'Missing phone.' }, 400)

  if (action === 'bot') {
    const paused = !!body.paused
    await store.setFlags(phone, paused ? { botPaused: true } : { botPaused: false, needsHuman: false })
    return json({ ok: true })
  }

  if (action === 'send') {
    const text = typeof body.text === 'string' ? body.text.trim().slice(0, 4096) : ''
    if (!text) return json({ error: 'Type a message first.' }, 400)
    const contact = await store.contact(phone)
    if (!canReply(contact)) {
      return json({ error: 'This customer’s 24-hour reply window has closed. WhatsApp only allows a free reply within 24 hours of their last message. You can reply when they message again.' }, 409)
    }
    const sent = await sendText(phone, text)
    if (!sent.ok) return json({ error: 'WhatsApp did not accept the message. Check the access token and number in Vercel, then try again.' }, 502)
    await store.saveOutbound({ phone, sender: 'agent', body: text, waId: sent.id })
    // a person is now handling this chat, so the AI steps back
    await store.setFlags(phone, { botPaused: true, needsHuman: false })
    return json({ ok: true })
  }

  return json({ error: 'Unknown action.' }, 400)
}
