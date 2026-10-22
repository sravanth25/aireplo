import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, Bot, Hand, Lock, LogOut, RefreshCw, Search, SendHorizontal, UserRound } from 'lucide-react'
import { AireploMark } from '@/components/AireploMark'
import { waToHtml } from '@/lib/waFormat'
import { cn } from '@/lib/utils'

type Contact = {
  phone: string
  name: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  lastInboundAt: string | null
  unread: number
  botPaused: boolean
  needsHuman: boolean
  canReply?: boolean
}
type Message = { id: number; phone: string; sender: 'customer' | 'ai' | 'agent'; body: string; createdAt: string }

const KEY = 'aireplo-inbox-pw'
const readPw = () => {
  try {
    return sessionStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}
const writePw = (v: string) => {
  try {
    if (v) sessionStorage.setItem(KEY, v)
    else sessionStorage.removeItem(KEY)
  } catch {
    /* storage blocked: stay signed in for this tab only */
  }
}

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function api<T>(pw: string, query: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/inbox?${query}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${pw}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error ?? `Something went wrong (${res.status}).`, res.status)
  return data as T
}

const displayPhone = (p: string) => '+' + p
const initials = (c: Contact) => (c.name ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '#'
function when(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const y = new Date(today)
  y.setDate(today.getDate() - 1)
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

function Login({ onLogin, error }: { onLogin: (pw: string) => void; error: string }) {
  const [pw, setPw] = useState('')
  return (
    <div className="grid min-h-dvh place-items-center bg-ink px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (pw) onLogin(pw)
        }}
        className="w-full max-w-sm rounded-2xl border border-line bg-panel p-8"
      >
        <AireploMark className="size-11" />
        <h1 className="font-display mt-5 text-2xl font-bold text-white">Team inbox</h1>
        <p className="mt-1 text-sm text-white/55">Every WhatsApp conversation with your customers.</p>
        <label htmlFor="inbox-pw" className="mt-6 block text-sm text-white/70">Password</label>
        <input
          id="inbox-pw"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white outline-none focus:border-brand/60"
        />
        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
        <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-ink hover:brightness-110">
          <Lock className="size-4" /> Open inbox
        </button>
        <a href="/" className="mt-4 block text-center text-xs text-white/40 hover:text-white/70">Back to website</a>
      </form>
    </div>
  )
}

export function Inbox() {
  const [pw, setPw] = useState(readPw)
  const [authError, setAuthError] = useState('')
  const [contacts, setContacts] = useState<Contact[] | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [chat, setChat] = useState<{ contact: Contact | null; messages: Message[] } | null>(null)
  const [filter, setFilter] = useState<'all' | 'human' | 'unread'>('all')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const bottom = useRef<HTMLDivElement>(null)
  const lastCount = useRef(0)

  const logout = useCallback((msg = '') => {
    writePw('')
    setPw('')
    setContacts(null)
    setChat(null)
    setSelected(null)
    setAuthError(msg)
  }, [])

  const handle = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401) logout('Wrong password. Try again.')
      else setNotice(e instanceof Error ? e.message : 'Something went wrong.')
    },
    [logout],
  )

  const loadContacts = useCallback(async () => {
    if (!pw) return
    try {
      const d = await api<{ contacts: Contact[] }>(pw, 'action=contacts')
      setContacts(d.contacts)
      setNotice('')
    } catch (e) {
      handle(e)
    }
  }, [pw, handle])

  const loadChat = useCallback(async () => {
    if (!pw || !selected) return
    try {
      const d = await api<{ contact: Contact | null; messages: Message[] }>(pw, `action=messages&phone=${selected}`)
      setChat(d)
    } catch (e) {
      handle(e)
    }
  }, [pw, selected, handle])

  // live updates: chat list every 6s, open chat every 4s
  useEffect(() => {
    loadContacts()
    const t = setInterval(loadContacts, 6000)
    return () => clearInterval(t)
  }, [loadContacts])
  useEffect(() => {
    setChat(null)
    lastCount.current = 0
    loadChat()
    const t = setInterval(loadChat, 4000)
    return () => clearInterval(t)
  }, [loadChat])
  useEffect(() => {
    const n = chat?.messages.length ?? 0
    if (n !== lastCount.current) bottom.current?.scrollIntoView({ block: 'end' })
    lastCount.current = n
  }, [chat])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (contacts ?? []).filter((c) => {
      if (filter === 'human' && !c.needsHuman) return false
      if (filter === 'unread' && !c.unread) return false
      return !q || c.phone.includes(q.replace(/\D/g, '') || '§') || (c.name ?? '').toLowerCase().includes(q) || (c.lastMessage ?? '').toLowerCase().includes(q)
    })
  }, [contacts, filter, query])

  const counts = useMemo(() => ({ human: (contacts ?? []).filter((c) => c.needsHuman).length, unread: (contacts ?? []).filter((c) => c.unread).length }), [contacts])

  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (!selected || !draft.trim() || sending) return
    setSending(true)
    try {
      await api(pw, 'action=send', { phone: selected, text: draft })
      setDraft('')
      setNotice('')
      await Promise.all([loadChat(), loadContacts()])
    } catch (err) {
      handle(err)
    } finally {
      setSending(false)
    }
  }

  const toggleBot = async (paused: boolean) => {
    if (!selected) return
    try {
      await api(pw, 'action=bot', { phone: selected, paused })
      await Promise.all([loadChat(), loadContacts()])
    } catch (err) {
      handle(err)
    }
  }

  if (!pw) return <Login error={authError} onLogin={(v) => { writePw(v); setAuthError(''); setPw(v) }} />

  const c = chat?.contact ?? contacts?.find((x) => x.phone === selected) ?? null

  return (
    <div className="flex h-dvh flex-col bg-ink text-white">
      <header className="flex items-center gap-3 border-b border-line bg-[#0b0f14] px-4 py-3" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <AireploMark className="size-8" />
        <h1 className="font-display text-lg font-bold">Team inbox</h1>
        <span className="hidden text-xs text-white/40 sm:inline">Updates automatically</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => { loadContacts(); loadChat() }} className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white" aria-label="Refresh"><RefreshCw className="size-4" /></button>
          <button onClick={() => logout()} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"><LogOut className="size-4" /> Sign out</button>
        </div>
      </header>

      {notice && <p className="border-b border-amber-300/20 bg-amber-300/[0.08] px-4 py-2 text-sm text-amber-200" role="alert">{notice}</p>}

      <div className="flex min-h-0 flex-1">
        {/* chat list */}
        <aside className={cn('min-h-0 w-full flex-col border-r border-line md:flex md:w-[340px] md:shrink-0', selected ? 'hidden' : 'flex')} aria-label="Conversations">
          <div className="space-y-3 border-b border-line p-3">
            <label className="relative block">
              <span className="sr-only">Search chats</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, number or message" className="w-full rounded-xl bg-white/[0.05] py-2.5 pr-3 pl-9 text-sm outline-none placeholder:text-white/35 focus:ring-1 focus:ring-brand/60" />
            </label>
            <div className="flex gap-1.5" role="group" aria-label="Filter chats">
              {([['all', 'All'], ['human', `Needs a person${counts.human ? ` (${counts.human})` : ''}`], ['unread', `Unread${counts.unread ? ` (${counts.unread})` : ''}`]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-colors', filter === k ? 'bg-brand text-ink' : 'bg-white/[0.05] text-white/65 hover:text-white')}>{l}</button>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {contacts === null && <p className="p-6 text-sm text-white/45">Loading chats…</p>}
            {contacts?.length === 0 && (
              <div className="p-6 text-sm text-white/55">
                <p className="font-medium text-white">No conversations yet</p>
                <p className="mt-1">When a customer messages your WhatsApp number, the chat appears here with the AI’s replies.</p>
              </div>
            )}
            {contacts && contacts.length > 0 && visible.length === 0 && <p className="p-6 text-sm text-white/45">No chats match.</p>}
            {visible.map((x) => (
              <button
                key={x.phone}
                onClick={() => setSelected(x.phone)}
                aria-current={selected === x.phone}
                className={cn('flex w-full items-center gap-3 border-b border-white/[0.04] px-3 py-3 text-left transition-colors hover:bg-white/[0.04]', selected === x.phone && 'bg-white/[0.06]')}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#1f2c34] text-sm font-semibold text-white/80">{initials(x)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium">{x.name ?? displayPhone(x.phone)}</span>
                    <span className={cn('shrink-0 text-[11px]', x.unread ? 'text-brand' : 'text-white/40')}>{when(x.lastMessageAt)}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className="truncate text-sm text-white/50">{(x.lastMessage ?? '').replace(/[*_~`]/g, '')}</span>
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                      {x.needsHuman && <span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-[10px] font-semibold text-amber-200">Needs a person</span>}
                      {!x.needsHuman && x.botPaused && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">AI paused</span>}
                      {x.unread > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-ink">{x.unread}</span>}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* open chat */}
        <section className={cn('min-h-0 min-w-0 flex-1 flex-col bg-[#0b141a] md:flex', selected ? 'flex' : 'hidden')} aria-label="Conversation">
          {!selected ? (
            <div className="m-auto max-w-xs p-6 text-center text-sm text-white/45">
              <AireploMark className="mx-auto size-12 opacity-80" />
              <p className="mt-4">Choose a chat to read the conversation and reply.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3 border-b border-line bg-[#1f2c34] px-3 py-2.5">
                <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 md:hidden" aria-label="Back to chats"><ArrowLeft className="size-5" /></button>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0b141a] text-sm font-semibold text-white/80">{c ? initials(c) : <UserRound className="size-4" />}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c?.name ?? displayPhone(selected)}</p>
                  <p className="text-xs text-white/50 select-all">{displayPhone(selected)}</p>
                </div>
                {c?.botPaused ? (
                  <button onClick={() => toggleBot(false)} className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-xs font-semibold text-ink hover:brightness-110"><Bot className="size-4" /> Resume AI</button>
                ) : (
                  <button onClick={() => toggleBot(true)} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10"><Hand className="size-4" /> Take over</button>
                )}
              </div>
              <p className={cn('px-4 py-1.5 text-center text-[11px]', c?.botPaused ? 'bg-amber-300/[0.08] text-amber-200' : 'bg-brand/[0.08] text-brand')}>
                {c?.botPaused ? 'AI is paused for this chat. You’re replying as your team.' : 'AI is replying to this customer automatically.'}
              </p>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:px-6">
                {chat === null && <p className="text-center text-sm text-white/40">Loading…</p>}
                {chat?.messages.map((m) => (
                  <div key={m.id} className={cn('flex', m.sender === 'customer' ? 'justify-start' : 'justify-end')}>
                    <div className={cn('max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed', m.sender === 'customer' ? 'rounded-tl-sm bg-[#1f2c34]' : m.sender === 'ai' ? 'rounded-tr-sm bg-[#005c4b]' : 'rounded-tr-sm bg-[#0e5a74]')}>
                      {m.sender !== 'customer' && (
                        <p className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-white/60">
                          {m.sender === 'ai' ? <><Bot className="size-3" /> AI</> : <><UserRound className="size-3" /> Team</>}
                        </p>
                      )}
                      <span className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: waToHtml(m.body) }} />
                      <p className="mt-1 text-right text-[10px] text-white/45">{new Date(m.createdAt).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottom} />
              </div>

              {c && c.canReply === false ? (
                <p className="border-t border-line bg-[#111b21] px-4 py-3 text-center text-xs text-white/55" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                  The 24-hour reply window has closed. WhatsApp allows a free reply only within 24 hours of the customer’s last message. You can reply when they write again.
                </p>
              ) : (
                <form onSubmit={send} className="flex items-end gap-2 border-t border-line bg-[#111b21] p-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                  <label htmlFor="inbox-reply" className="sr-only">Reply</label>
                  <textarea
                    id="inbox-reply"
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        e.currentTarget.form?.requestSubmit()
                      }
                    }}
                    placeholder={c?.botPaused ? 'Type a reply…' : 'Type a reply (this pauses the AI)…'}
                    className="max-h-40 min-h-11 min-w-0 flex-1 resize-none rounded-2xl bg-[#2a3942] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-brand/60"
                  />
                  <button type="submit" disabled={sending || !draft.trim()} className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-ink transition disabled:opacity-40" aria-label="Send reply">
                    <SendHorizontal className="size-5" />
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
