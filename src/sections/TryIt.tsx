import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RotateCcw, SendHorizontal, Smartphone } from 'lucide-react'
import { brand } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { QrCode } from '@/components/QrCode'
import { waToHtml } from '@/lib/waFormat'
import { SectionHeading } from '@/components/ui/section'
import { AireploMark } from '@/components/AireploMark'

type Msg = { from: 'bot' | 'me'; text: string }

// Suggested questions. With the live AI these are sent as normal messages;
// the scripted replies are only used when the AI is not connected (demo mode).
const OPTIONS: { label: string; me: string; bot: Msg[] }[] = [
  {
    label: '💰 Pricing',
    me: `How much does ${brand.name} cost?`,
    bot: [{ from: 'bot', text: `Packages start at *${brand.currency}14,999 one-time*. No monthly subscription: we set up everything and you own your Meta app. Want a quote?` }],
  },
  {
    label: '🤖 What can it do?',
    me: `What can ${brand.name} do for my business?`,
    bot: [{ from: 'bot', text: 'Send broadcasts to thousands, reply to every chat from one shared inbox, build no-code chatbots, and let an AI agent answer customers 24/7 in their language.' }],
  },
  {
    label: '🏷️ White-label',
    me: `Can I sell ${brand.name} under my own brand?`,
    bot: [{ from: 'bot', text: 'Yes! With the White-label Partner plan you get your own logo, colors and domain, and you set your own prices for clients.' }],
  },
  {
    label: '🗣️ Ask in Hindi',
    me: 'Setup mein kitna time lagta hai?',
    bot: [{ from: 'bot', text: '✨ Bas 48 ghante! Hum Meta verification, number setup aur templates sab mein help karte hain.' }],
  },
  {
    label: '🙋 Talk to a human',
    me: 'I want to talk to a person',
    bot: [{ from: 'bot', text: 'Sure 🙌 A team member will reply here shortly. Meanwhile, tell me your name and business so they can help faster.' }],
  },
]

const START: Msg[] = [{ from: 'bot', text: `Hi 👋 I’m ${brand.name}’s AI assistant. Ask me anything about WhatsApp marketing, pricing or white-label plans.` }]

const OFFLINE_REPLY = `This preview isn’t connected to the live AI yet, so I can only answer the suggested questions. Once ${brand.name} is live, I’ll answer anything you type here.`

export function TryIt() {
  const [msgs, setMsgs] = useState<Msg[]>(START)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  // null = not tried yet, true = live AI answered, false = falling back to scripted demo
  const [live, setLive] = useState<boolean | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const abort = useRef<AbortController | null>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])
  useEffect(() => () => abort.current?.abort(), [])

  const scripted = async (text: string) => {
    await new Promise((r) => setTimeout(r, 900))
    const o = OPTIONS.find((x) => x.me === text)
    setMsgs((m) => [...m, ...(o ? o.bot : [{ from: 'bot' as const, text: OFFLINE_REPLY }])])
  }

  const askLive = async (history: Msg[]) => {
    const ctrl = new AbortController()
    abort.current = ctrl
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.map((m) => ({ role: m.from === 'me' ? 'user' : 'assistant', content: m.text })) }),
      signal: ctrl.signal,
    })
    if (!res.ok || !res.body) throw new Error(`chat unavailable (${res.status})`)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''
    let started = false
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      if (!started) {
        started = true
        setTyping(false)
        setMsgs((m) => [...m, { from: 'bot', text }])
      } else {
        setMsgs((m) => [...m.slice(0, -1), { from: 'bot', text }])
      }
    }
    if (!started) throw new Error('empty reply')
  }

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text || typing) return
    const history = [...msgs, { from: 'me' as const, text }]
    setMsgs(history)
    setInput('')
    setTyping(true)
    try {
      if (live === false) await scripted(text)
      else {
        await askLive(history)
        setLive(true)
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setLive(false)
      await scripted(text)
    } finally {
      setTyping(false)
    }
  }

  const reset = () => {
    abort.current?.abort()
    setTyping(false)
    setMsgs(START)
  }

  return (
    <section id="try" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Try it yourself" title="Chat with Aireplo’s AI agent" sub="Type any question, or tap a suggestion. Your customers get the same instant replies on WhatsApp." />
        <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14">
          {/* phone */}
          <div className="mx-auto w-full max-w-[400px] rounded-[2.2rem] border border-white/10 bg-[#0b141a] p-2.5 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between rounded-t-[1.8rem] bg-[#1f2c34] px-4 py-3">
              <div className="flex items-center gap-3">
                <AireploMark className="size-9" />
                <div>
                  <p className="text-sm font-semibold text-white">{brand.name}</p>
                  <p className="text-[11px] text-white/55">{typing ? 'typing…' : live === false ? 'demo mode' : 'online'}</p>
                </div>
              </div>
              <button onClick={reset} className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Restart demo chat">
                <RotateCcw className="size-4" />
              </button>
            </div>
            <div ref={scroller} className="h-[360px] space-y-2.5 overflow-y-auto bg-[#0b141a] px-3 py-4" aria-live="polite">
              <AnimatePresence initial={false}>
                {msgs.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={m.from === 'me' ? 'flex justify-end' : 'flex'}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed text-white ${m.from === 'me' ? 'rounded-tr-sm bg-[#005c4b]' : 'rounded-tl-sm bg-[#1f2c34]'}`}>
                      <span className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: waToHtml(m.text) }} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && (
                <div className="flex w-fit gap-1 rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 py-3" aria-label="Bot is typing">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-b-[1.8rem] border-t border-white/5 bg-[#111b21] p-3">
              <div className="flex flex-wrap gap-1.5 pb-2.5">
                {OPTIONS.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => send(o.me)}
                    disabled={typing}
                    className="rounded-full border border-[#53bdeb]/30 px-3 py-1.5 text-xs font-medium text-[#53bdeb] transition-colors hover:bg-[#53bdeb]/10 disabled:opacity-40"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
                className="flex items-center gap-2"
              >
                <label htmlFor="try-input" className="sr-only">Type a message</label>
                <input
                  id="try-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  placeholder="Type any question…"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-full bg-[#2a3942] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-brand/60"
                />
                <button type="submit" disabled={typing || !input.trim()} aria-label="Send message" className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-ink transition disabled:opacity-40">
                  <SendHorizontal className="size-4" />
                </button>
              </form>
            </div>
          </div>

          {/* real number */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-white/60">
              <Smartphone className="size-3.5" /> Prefer your own phone?
            </p>
            <h3 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">Send “Hi” to our WhatsApp</h3>
            <p className="mt-3 max-w-md text-white/60 max-lg:mx-auto">Scan the code or tap the button. Our own AI agent replies in seconds, any time of day.</p>
            <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row lg:items-center">
              <div className="rounded-2xl bg-white p-3">
                <QrCode text={waLink('Hi')} alt={`QR code to chat with ${brand.name} on WhatsApp`} className="size-36" />
              </div>
              <div className="flex flex-col items-center gap-3 sm:items-start">
                <p className="font-display text-2xl font-bold tracking-wide text-white select-all">{brand.whatsappDisplay}</p>
                <a href={waLink('Hi')} target="_blank" rel="noreferrer" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink hover:brightness-110">
                  Open WhatsApp chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
