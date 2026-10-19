import { useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Bold, Code, Download, ExternalLink, Italic, Link2, MessageSquareText, Strikethrough, Type, Wrench } from 'lucide-react'
import { brand } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { templates, fillTemplate, type Template } from '@/lib/templates'
import { waToHtml } from '@/lib/waFormat'
import { useQrDataUrl } from '@/components/QrCode'
import { CopyButton } from '@/components/CopyButton'
import { Spotlight } from '@/components/ui/spotlight'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { cn } from '@/lib/utils'

const field = 'w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/60'

const COUNTRIES = [
  ['91', '🇮🇳 +91'],
  ['971', '🇦🇪 +971'],
  ['1', '🇺🇸 +1'],
  ['44', '🇬🇧 +44'],
  ['65', '🇸🇬 +65'],
  ['966', '🇸🇦 +966'],
  ['61', '🇦🇺 +61'],
]

function Bubble({ html, buttons }: { html: string; buttons?: string[] }) {
  return (
    <div className="rounded-2xl bg-[#0b141a] p-4">
      <div className="max-w-[92%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-3.5 py-2.5 text-sm leading-relaxed text-white">
        <div className="break-words" dangerouslySetInnerHTML={{ __html: html || '<span class="text-white/40">Your message preview</span>' }} />
        <p className="mt-1 text-right text-[10px] text-white/40">10:24 AM</p>
        {buttons && buttons.length > 0 && (
          <div className="-mx-3.5 -mb-2.5 mt-2 divide-y divide-white/5 border-t border-white/5">
            {buttons.map((b) => (
              <p key={b} className="py-2 text-center text-sm font-medium text-[#53bdeb]">{b}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LinkGenerator() {
  const [cc, setCc] = useState('91')
  const [phone, setPhone] = useState('9876543210')
  const [msg, setMsg] = useState('Hi! I saw your Instagram post and want to know more.')
  const digits = phone.replace(/\D/g, '')
  const valid = digits.length >= 6 && digits.length <= 14
  const link = valid ? waLink(msg.trim() || undefined, cc + digits) : ''
  const qr = useQrDataUrl(link || 'https://wa.me/')
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5 rounded-2xl border border-line bg-panel p-6">
        <div>
          <label htmlFor="wa-phone" className="text-sm text-white/70">WhatsApp number</label>
          <div className="mt-1.5 flex gap-2">
            <select id="wa-cc" aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)} className={cn(field, 'w-32 shrink-0')}>
              {COUNTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <input id="wa-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn(field, 'min-w-0')} placeholder="98765 43210" />
          </div>
          {!valid && <p className="mt-1.5 text-xs text-red-400">Enter a phone number without the country code, e.g. 9876543210.</p>}
        </div>
        <div>
          <label htmlFor="wa-msg" className="text-sm text-white/70">Pre-filled message <span className="text-white/40">(optional)</span></label>
          <textarea id="wa-msg" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} className={cn(field, 'mt-1.5 resize-none')} />
        </div>
        <div>
          <p className="text-sm text-white/70">Your WhatsApp link</p>
          <div className="mt-1.5 overflow-x-auto rounded-xl border border-brand/30 bg-brand/[0.06] px-4 py-3 font-mono text-sm break-all text-brand">{link || '—'}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={link} label="Copy link" />
            {link && (
              <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-white hover:bg-white/5">
                <ExternalLink className="size-4" /> Test link
              </a>
            )}
          </div>
        </div>
        <p className="text-xs text-white/40">Use the link in your Instagram bio, Google Business profile, website buttons and ads.</p>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-panel p-6">
        <p className="text-sm font-medium text-white/70">QR code</p>
        <div className="rounded-2xl bg-white p-3">{qr && <img src={qr} alt="QR code for your WhatsApp link" className="size-52" />}</div>
        <p className="text-center text-xs text-white/45">Print it on bills, packaging, menus and shop counters.</p>
        {qr && valid && (
          <a href={qr} download={`whatsapp-qr-${digits}.png`} className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:brightness-110">
            <Download className="size-4" /> Download QR
          </a>
        )}
      </div>
    </div>
  )
}

function TemplateLibrary() {
  const cats = ['All', 'Marketing', 'Utility', 'Authentication'] as const
  const [cat, setCat] = useState<(typeof cats)[number]>('All')
  const list = useMemo(() => templates.filter((t) => cat === 'All' || t.category === cat), [cat])
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Template category">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', cat === c ? 'border-brand bg-brand/15 text-white' : 'border-line text-white/60 hover:text-white')}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => <TemplateCard key={t.id} t={t} />)}
      </div>
      <p className="mt-6 text-xs text-white/40">Variables like {'{{1}}'} are filled in per customer when you send. Meta must approve each template before you use it — {brand.name} submits them for you.</p>
    </div>
  )
}

function TemplateCard({ t }: { t: Template }) {
  const tone = t.category === 'Marketing' ? 'text-amber-300 bg-amber-300/10' : t.category === 'Utility' ? 'text-sky-300 bg-sky-300/10' : 'text-fuchsia-300 bg-fuchsia-300/10'
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-center justify-between gap-2 px-1">
        <h3 className="font-semibold text-white">{t.name}</h3>
        <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium', tone)}>{t.category}</span>
      </div>
      <p className="mt-0.5 px-1 text-xs text-white/40">{t.industry}</p>
      <div className="mt-3 flex-1"><Bubble html={waToHtml(fillTemplate(t.body, t.sample))} buttons={t.buttons} /></div>
      <CopyButton text={t.body} label="Copy template" className="mt-3 w-full" />
    </div>
  )
}

function Formatter() {
  const [text, setText] = useState('*Flat 40% off* on all kurtas 🎉\n_Only till Sunday_\n~₹1,499~ now ₹899\nUse code ```DIWALI40```')
  const ref = useRef<HTMLTextAreaElement>(null)
  const wrap = (mark: string) => {
    const ta = ref.current
    if (!ta) return
    const { selectionStart: a, selectionEnd: b } = ta
    const sel = text.slice(a, b) || 'text'
    const next = text.slice(0, a) + mark + sel + mark + text.slice(b)
    setText(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(a + mark.length, a + mark.length + sel.length)
    })
  }
  const tools = [
    { icon: Bold, mark: '*', label: 'Bold' },
    { icon: Italic, mark: '_', label: 'Italic' },
    { icon: Strikethrough, mark: '~', label: 'Strikethrough' },
    { icon: Code, mark: '```', label: 'Monospace' },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-line bg-panel p-6">
        <div className="flex flex-wrap items-center gap-2">
          {tools.map((t) => (
            <button key={t.label} onClick={() => wrap(t.mark)} title={t.label} aria-label={t.label} className="grid size-9 place-items-center rounded-lg border border-line text-white hover:bg-white/5">
              <t.icon className="size-4" />
            </button>
          ))}
          <span className="ml-auto text-xs text-white/40 tabular-nums">{text.length} characters</span>
        </div>
        <label htmlFor="fmt" className="sr-only">Message text</label>
        <textarea id="fmt" ref={ref} rows={9} value={text} onChange={(e) => setText(e.target.value)} className={cn(field, 'mt-4 resize-y font-mono')} />
        <p className="mt-3 text-xs text-white/45">Select text and tap a button, or type *bold*, _italic_, ~strike~ and ```mono``` yourself.</p>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6">
        <p className="text-sm font-medium text-white/70">Preview in WhatsApp</p>
        <Bubble html={waToHtml(text)} />
        <CopyButton text={text} label="Copy formatted text" className="self-start" />
      </div>
    </div>
  )
}

const TABS = [
  { id: 'link', label: 'Link & QR generator', icon: Link2, title: 'WhatsApp link & QR code generator', sub: 'Create a click-to-chat link and QR code for your number in seconds.', el: LinkGenerator },
  { id: 'templates', label: 'Template library', icon: MessageSquareText, title: 'WhatsApp message templates', sub: 'Ready-to-use templates for sales, orders, reminders and OTPs. Copy and adapt.', el: TemplateLibrary },
  { id: 'format', label: 'Text formatter', icon: Type, title: 'WhatsApp text formatter', sub: 'Make words bold, italic or crossed out, and preview before you send.', el: Formatter },
] as const

export function Tools() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('link')
  const active = TABS.find((t) => t.id === tab)!
  const El = active.el
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-10 sm:pt-40">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand">
            <Wrench className="size-3.5" /> 100% free · No sign-up
          </p>
          <h1 className="font-display mt-6 text-[2.4rem] leading-[1.05] font-extrabold text-white sm:text-6xl">Free WhatsApp tools for business</h1>
          <p className="mx-auto mt-5 max-w-xl text-white/60">Generate chat links and QR codes, grab proven message templates, and format your texts.</p>
        </motion.div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:justify-center" role="tablist" aria-label="Free tools">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn('inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors', tab === t.id ? 'border-brand bg-brand text-ink' : 'border-line text-white/70 hover:text-white')}
              >
                <t.icon className="size-4" /> {t.label}
              </button>
            ))}
          </div>
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{active.title}</h2>
            <p className="mt-2 text-white/55">{active.sub}</p>
            <div className="mt-6" role="tabpanel"><El /></div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-brand/30 bg-gradient-to-b from-brand/[0.12] to-panel p-8 text-center sm:p-12">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Send these to thousands, automatically</h2>
            <p className="max-w-xl text-white/60">{brand.name} sends templates as broadcasts, replies with an AI agent and tracks every sale, from {brand.currency}799/month.</p>
            <ShimmerButton href="#pricing">See plans</ShimmerButton>
          </div>
        </div>
      </section>
    </>
  )
}
