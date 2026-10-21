import { neon } from '@neondatabase/serverless'
import type { ChatTurn } from './agent.js'

// Conversation storage for the WhatsApp bot and the team inbox.
// Uses the Neon Postgres database when DATABASE_URL is set (Vercel → Storage),
// otherwise an in-memory store (local tests; data is lost on restart).

export type Contact = {
  phone: string
  name: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  lastInboundAt: string | null
  unread: number
  botPaused: boolean
  needsHuman: boolean
}

export type Sender = 'customer' | 'ai' | 'agent'

export type Message = {
  id: number
  phone: string
  sender: Sender
  body: string
  createdAt: string
}

export interface Store {
  /** Save a customer's message. Returns false if this WhatsApp message id was already saved (Meta retry). */
  saveInbound(m: { phone: string; name?: string; waId: string; body: string }): Promise<boolean>
  saveOutbound(m: { phone: string; sender: 'ai' | 'agent'; body: string; waId?: string }): Promise<void>
  history(phone: string, limit?: number): Promise<ChatTurn[]>
  contact(phone: string): Promise<Contact | null>
  contacts(): Promise<Contact[]>
  messages(phone: string): Promise<Message[]>
  markRead(phone: string): Promise<void>
  setFlags(phone: string, flags: { botPaused?: boolean; needsHuman?: boolean }): Promise<void>
}

const toTurn = (sender: string, body: string): ChatTurn => ({ role: sender === 'customer' ? 'user' : 'assistant', content: body })

// ---------- Postgres (Neon) ----------
function pgStore(url: string): Store {
  const sql = neon(url)
  let ready: Promise<unknown> | null = null
  const schema = () =>
    (ready ??= (async () => {
      await sql`create table if not exists contacts (
        phone text primary key,
        name text,
        last_message text,
        last_message_at timestamptz,
        last_inbound_at timestamptz,
        unread integer not null default 0,
        bot_paused boolean not null default false,
        needs_human boolean not null default false,
        created_at timestamptz not null default now()
      )`
      await sql`create table if not exists messages (
        id bigserial primary key,
        phone text not null,
        sender text not null,
        body text not null,
        wa_id text unique,
        created_at timestamptz not null default now()
      )`
      await sql`create index if not exists messages_phone_id on messages (phone, id)`
    })().catch((e) => {
      ready = null // retry on next call
      throw e
    }))

  const contactRow = (r: Record<string, unknown>): Contact => ({
    phone: r.phone as string,
    name: (r.name as string) ?? null,
    lastMessage: (r.last_message as string) ?? null,
    lastMessageAt: r.last_message_at ? new Date(r.last_message_at as string).toISOString() : null,
    lastInboundAt: r.last_inbound_at ? new Date(r.last_inbound_at as string).toISOString() : null,
    unread: Number(r.unread ?? 0),
    botPaused: !!r.bot_paused,
    needsHuman: !!r.needs_human,
  })

  return {
    async saveInbound({ phone, name, waId, body }) {
      await schema()
      const inserted = await sql`insert into messages (phone, sender, body, wa_id) values (${phone}, 'customer', ${body}, ${waId})
        on conflict (wa_id) do nothing returning id`
      if (!inserted.length) return false
      await sql`insert into contacts (phone, name, last_message, last_message_at, last_inbound_at, unread)
        values (${phone}, ${name ?? null}, ${body}, now(), now(), 1)
        on conflict (phone) do update set
          name = coalesce(excluded.name, contacts.name),
          last_message = excluded.last_message,
          last_message_at = now(),
          last_inbound_at = now(),
          unread = contacts.unread + 1`
      return true
    },
    async saveOutbound({ phone, sender, body, waId }) {
      await schema()
      await sql`insert into messages (phone, sender, body, wa_id) values (${phone}, ${sender}, ${body}, ${waId ?? null}) on conflict (wa_id) do nothing`
      await sql`insert into contacts (phone, last_message, last_message_at) values (${phone}, ${body}, now())
        on conflict (phone) do update set last_message = excluded.last_message, last_message_at = now()`
    },
    async history(phone, limit = 20) {
      await schema()
      const rows = await sql`select sender, body from (select id, sender, body from messages where phone = ${phone} order by id desc limit ${limit}) t order by id`
      return rows.map((r) => toTurn(r.sender as string, r.body as string))
    },
    async contact(phone) {
      await schema()
      const rows = await sql`select * from contacts where phone = ${phone}`
      return rows[0] ? contactRow(rows[0]) : null
    },
    async contacts() {
      await schema()
      const rows = await sql`select * from contacts order by last_message_at desc nulls last limit 500`
      return rows.map(contactRow)
    },
    async messages(phone) {
      await schema()
      const rows = await sql`select * from (select id, phone, sender, body, created_at from messages where phone = ${phone} order by id desc limit 300) t order by id`
      return rows.map((r) => ({ id: Number(r.id), phone: r.phone as string, sender: r.sender as Sender, body: r.body as string, createdAt: new Date(r.created_at as string).toISOString() }))
    },
    async markRead(phone) {
      await schema()
      await sql`update contacts set unread = 0 where phone = ${phone}`
    },
    async setFlags(phone, { botPaused, needsHuman }) {
      await schema()
      await sql`insert into contacts (phone, bot_paused, needs_human) values (${phone}, ${botPaused ?? false}, ${needsHuman ?? false})
        on conflict (phone) do update set
          bot_paused = coalesce(${botPaused ?? null}::boolean, contacts.bot_paused),
          needs_human = coalesce(${needsHuman ?? null}::boolean, contacts.needs_human)`
    },
  }
}

// ---------- In-memory (no database configured) ----------
function memoryStore(): Store {
  const contacts = new Map<string, Contact>()
  const msgs: (Message & { waId?: string })[] = []
  let seq = 0
  const now = () => new Date().toISOString()
  const get = (phone: string): Contact => {
    let c = contacts.get(phone)
    if (!c) {
      c = { phone, name: null, lastMessage: null, lastMessageAt: null, lastInboundAt: null, unread: 0, botPaused: false, needsHuman: false }
      contacts.set(phone, c)
    }
    return c
  }
  return {
    async saveInbound({ phone, name, waId, body }) {
      if (msgs.some((m) => m.waId === waId)) return false
      msgs.push({ id: ++seq, phone, sender: 'customer', body, createdAt: now(), waId })
      const c = get(phone)
      c.name = name ?? c.name
      c.lastMessage = body
      c.lastMessageAt = c.lastInboundAt = now()
      c.unread++
      return true
    },
    async saveOutbound({ phone, sender, body, waId }) {
      msgs.push({ id: ++seq, phone, sender, body, createdAt: now(), waId })
      const c = get(phone)
      c.lastMessage = body
      c.lastMessageAt = now()
    },
    async history(phone, limit = 20) {
      return msgs.filter((m) => m.phone === phone).slice(-limit).map((m) => toTurn(m.sender, m.body))
    },
    async contact(phone) {
      return contacts.get(phone) ?? null
    },
    async contacts() {
      return [...contacts.values()].sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''))
    },
    async messages(phone) {
      return msgs.filter((m) => m.phone === phone).map(({ waId: _w, ...m }) => m)
    },
    async markRead(phone) {
      get(phone).unread = 0
    },
    async setFlags(phone, { botPaused, needsHuman }) {
      const c = get(phone)
      if (botPaused !== undefined) c.botPaused = botPaused
      if (needsHuman !== undefined) c.needsHuman = needsHuman
    },
  }
}

export const hasDatabase = !!process.env.DATABASE_URL
export const store: Store = process.env.DATABASE_URL ? pgStore(process.env.DATABASE_URL) : memoryStore()

/** Meta only allows free-form replies within 24 hours of the customer's last message. */
export function canReply(c: Contact | null) {
  return !!c?.lastInboundAt && Date.now() - new Date(c.lastInboundAt).getTime() < 24 * 60 * 60 * 1000
}

/** Customer is asking for a person. */
export function wantsHuman(text: string) {
  return /\b(talk|speak|chat|connect)\s+(to|with)\s+(a\s+|an\s+|your\s+|the\s+)?(human|person|someone|team|agent|executive|representative)\b|\breal\s+person\b|\bhuman\s+agent\b|\bcall\s+me\b|\bcustomer\s+care\b|insaan\s+se\s+baat|kisi\s+se\s+baat|banda\s+se\s+baat/i.test(text)
}
