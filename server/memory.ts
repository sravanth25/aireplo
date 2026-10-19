import type { ChatTurn } from './agent.js'

// Short-term chat memory per WhatsApp number.
// In-memory only: it survives while the server instance stays warm, and is lost on cold starts.
// For production, swap this for Redis/Postgres (e.g. Upstash Redis on Vercel) — same three functions.

const TTL_MS = 24 * 60 * 60 * 1000
const MAX_TURNS = 20
const chats = new Map<string, { turns: ChatTurn[]; at: number }>()
const seen = new Map<string, number>()

export function getHistory(phone: string): ChatTurn[] {
  const c = chats.get(phone)
  if (!c || Date.now() - c.at > TTL_MS) return []
  return c.turns
}

export function addTurns(phone: string, ...turns: ChatTurn[]) {
  const all = [...getHistory(phone), ...turns].slice(-MAX_TURNS)
  chats.set(phone, { turns: all, at: Date.now() })
}

/** Meta can deliver the same message twice; returns true the first time only. */
export function firstTime(messageId: string) {
  const now = Date.now()
  for (const [id, t] of seen) if (now - t > TTL_MS) seen.delete(id)
  if (seen.has(messageId)) return false
  seen.set(messageId, now)
  return true
}
