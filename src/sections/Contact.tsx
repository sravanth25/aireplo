import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { brand, needs } from '@/brand'
import { Spotlight } from '@/components/ui/spotlight'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/whatsapp'

export function Contact() {
  const [picked, setPicked] = useState<string[]>([])
  const [fallback, setFallback] = useState('')
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = [
      `New requirement for ${brand.name}`,
      `Name: ${f.get('name')}`,
      `Business: ${f.get('business')}`,
      `Phone: ${f.get('phone')}`,
      `Modules: ${picked.length ? picked.join(', ') : 'Not sure yet'}`,
      `White-label: ${f.get('whitelabel') ? 'Yes' : 'No'}`,
      `Notes: ${f.get('notes') || '-'}`,
    ].join('\n')
    const href = waLink(text)
    // if the browser blocks the new tab, show a link the visitor can tap instead
    const win = window.open(href, '_blank')
    if (win) win.opener = null
    setFallback(win ? '' : href)
  }
  const input = 'w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/60'
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden py-24">
      <Spotlight className="-top-60 left-0 md:left-40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Get started</p>
          <h2 className="font-display mt-3 text-4xl font-bold text-white sm:text-5xl">Tell us what you need. We’ll build your dashboard.</h2>
          <p className="mt-4 text-white/60">Share your requirements and get a branded demo and a price quote within 24 hours.</p>
          <p className="mt-8 text-sm text-white/50">Prefer email? <a className="text-brand underline-offset-4 hover:underline" href={`mailto:${brand.email}`}>{brand.email}</a></p>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white/70">Your name<input required name="name" className={cn(input, 'mt-1.5')} placeholder="Ravi Kumar" /></label>
            <label className="text-sm text-white/70">Business<input required name="business" className={cn(input, 'mt-1.5')} placeholder="Ravi Fashions" /></label>
            <label className="text-sm text-white/70 sm:col-span-2">WhatsApp number<input required name="phone" type="tel" className={cn(input, 'mt-1.5')} placeholder="+91 98765 43210" /></label>
          </div>
          <p className="mt-5 text-sm text-white/70">What do you need?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {needs.map((m) => {
              const on = picked.includes(m)
              return (
                <button type="button" key={m} aria-pressed={on} onClick={() => setPicked((p) => (on ? p.filter((x) => x !== m) : [...p, m]))} className={cn('rounded-full border px-3 py-1.5 text-xs transition-colors', on ? 'border-brand bg-brand/15 text-white' : 'border-line text-white/60 hover:text-white')}>
                  {m}
                </button>
              )
            })}
          </div>
          <label className="mt-5 flex items-center gap-2.5 text-sm text-white/70"><input type="checkbox" name="whitelabel" className="size-4 accent-[#22c55e]" /> I want it under my own brand (white-label)</label>
          <label className="mt-5 block text-sm text-white/70">Anything else?<textarea name="notes" rows={3} className={cn(input, 'mt-1.5 resize-none')} placeholder="Monthly messages, integrations, launch date…" /></label>
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-ink transition hover:brightness-110">
            <Send className="size-4" /> Send requirements on WhatsApp
          </button>
          {fallback && (
            <a href={fallback} target="_blank" rel="noreferrer" className="mt-3 block text-center text-sm text-brand underline underline-offset-4">
              WhatsApp didn’t open? Tap here to send your requirements
            </a>
          )}
        </form>
      </div>
    </section>
  )
}
