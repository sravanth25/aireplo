import { useState, type FormEvent } from 'react'
import { Building2, Check, Send } from 'lucide-react'
import { brand, enterprise } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { Reveal } from '@/components/ui/section'
import { cn } from '@/lib/utils'

const steps = [
  ['Discovery call', 'We map your brands, teams, systems and goals.'],
  ['Written proposal', 'Scope, timeline and a fixed one-time price. No surprises.'],
  ['Build & integrate', 'Meta setup, your own Meta app, dashboard and integrations.'],
  ['Launch & handover', 'Training for your teams, documentation and full ownership.'],
]

export function Enterprise() {
  const [fallback, setFallback] = useState('')
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = [
      `Enterprise enquiry for ${brand.name}`,
      `Name: ${f.get('ename')}`,
      `Company: ${f.get('ecompany')}`,
      `Phone: ${f.get('ephone')}`,
      `Brands / outlets: ${f.get('ebrands') || '-'}`,
      `Needs: ${f.get('eneeds') || '-'}`,
    ].join('\n')
    const href = waLink(text)
    const win = window.open(href, '_blank')
    if (win) win.opener = null
    setFallback(win ? '' : href)
  }
  const input = 'mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/60'

  return (
    <section id="enterprise" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-line bg-[#0b0f14]">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                <Building2 className="size-3.5" /> Enterprise
              </p>
              <h2 className="font-display mt-5 text-3xl font-bold text-white sm:text-5xl">WhatsApp, built around your business</h2>
              <p className="mt-4 max-w-xl text-white/60">
                For chains, large brands and agencies that need more than a package. We design, build and hand over a WhatsApp platform that fits your systems. Custom pricing, one-time.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {enterprise.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-white/75"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{f}</li>
                ))}
              </ul>
              <ol className="mt-10 grid gap-4 sm:grid-cols-2">
                {steps.map(([t, b], i) => (
                  <Reveal key={t} delay={i * 0.05}>
                    <li className="flex gap-3">
                      <span className="font-display grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-ink">{i + 1}</span>
                      <span>
                        <span className="block text-sm font-semibold text-white">{t}</span>
                        <span className="block text-sm text-white/55">{b}</span>
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>

            <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-panel p-6">
              <p className="font-semibold text-white">Book a discovery call</p>
              <p className="mt-1 text-sm text-white/55">We reply within one working day with next steps.</p>
              <div className="mt-5 grid gap-4">
                <label className="text-sm text-white/70">Your name<input required name="ename" className={input} placeholder="Ananya Rao" /></label>
                <label className="text-sm text-white/70">Company<input required name="ecompany" className={input} placeholder="Rao Retail Pvt Ltd" /></label>
                <label className="text-sm text-white/70">WhatsApp number<input required name="ephone" type="tel" className={input} placeholder="+91 98765 43210" /></label>
                <label className="text-sm text-white/70">How many brands or outlets?<input name="ebrands" className={input} placeholder="e.g. 3 brands, 40 stores" /></label>
                <label className="text-sm text-white/70">What do you need?<textarea name="eneeds" rows={3} className={cn(input, 'resize-none')} placeholder="Systems to connect, teams, timeline…" /></label>
              </div>
              <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-ink transition hover:brightness-110">
                <Send className="size-4" /> Request a call on WhatsApp
              </button>
              {fallback && (
                <a href={fallback} target="_blank" rel="noreferrer" className="mt-3 block text-center text-sm text-brand underline underline-offset-4">
                  WhatsApp didn’t open? Tap here to send
                </a>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
