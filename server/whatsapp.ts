import { createHmac, timingSafeEqual } from 'node:crypto'

// Thin client for Meta's WhatsApp Cloud API.
// Env: WHATSAPP_TOKEN (permanent System User token), WHATSAPP_PHONE_NUMBER_ID, GRAPH_API_VERSION (optional).

const version = () => process.env.GRAPH_API_VERSION || 'v23.0'

async function graph(path: string, payload: unknown) {
  const res = await fetch(`https://graph.facebook.com/${version()}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) console.error('WhatsApp API error', res.status, await res.text())
  return res.ok
}

const phoneId = () => process.env.WHATSAPP_PHONE_NUMBER_ID

export function sendText(to: string, body: string) {
  // WhatsApp text messages are limited to 4096 characters
  return graph(`${phoneId()}/messages`, {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: body.slice(0, 4096), preview_url: true },
  })
}

/** Blue ticks + "typing…" indicator while the AI writes its reply. */
export function markReadAndTyping(messageId: string) {
  return graph(`${phoneId()}/messages`, {
    messaging_product: 'whatsapp',
    status: 'read',
    message_id: messageId,
    typing_indicator: { type: 'text' },
  })
}

/** Check that a webhook call really came from Meta (X-Hub-Signature-256 header, signed with your App Secret). */
export function isFromMeta(rawBody: string, signature: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret) return true // not configured yet: allow, but set it before going live
  if (!signature?.startsWith('sha256=')) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(signature.slice(7), 'hex')
  const b = Buffer.from(expected, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

// Shape of the parts of Meta's webhook payload we use
export type IncomingMessage = {
  from: string
  id: string
  type: string
  text?: { body: string }
  button?: { text: string }
  interactive?: { button_reply?: { title: string }; list_reply?: { title: string } }
}
type WebhookBody = {
  entry?: { changes?: { value?: { messages?: IncomingMessage[]; contacts?: { profile?: { name?: string } }[] } }[] }[]
}

export function extractMessages(body: unknown) {
  const out: { msg: IncomingMessage; name?: string }[] = []
  for (const entry of (body as WebhookBody)?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const name = change.value?.contacts?.[0]?.profile?.name
      for (const msg of change.value?.messages ?? []) out.push({ msg, name })
    }
  }
  return out
}

/** Turn any incoming message into text the AI can read. */
export function messageText(msg: IncomingMessage) {
  if (msg.type === 'text') return msg.text?.body ?? ''
  if (msg.type === 'button') return msg.button?.text ?? ''
  if (msg.type === 'interactive') return msg.interactive?.button_reply?.title ?? msg.interactive?.list_reply?.title ?? ''
  return `[The customer sent a ${msg.type} message, which you can't open. Ask them to type their question.]`
}
