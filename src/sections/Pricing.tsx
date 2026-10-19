import { useState } from 'react'
import { Check } from 'lucide-react'
import { brand, plans } from '@/brand'
import { Reveal, SectionHeading } from '@/components/ui/section'
import { BorderBeam } from '@/components/ui/border-beam'
import { cn } from '@/lib/utils'

export function Pricing() {
  const [yearly, setYearly] = useState(true)
  return (
    <section id="pricing" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Pricing" title="Simple prices. Lower than the rest." sub="No per-user fees. No markup on Meta charges. No setup fee." />
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-line bg-panel p-1 text-sm" role="group" aria-label="Billing period">
            {[['Monthly', false], ['Yearly · save 20%', true]].map(([l, v]) => (
              <button key={String(v)} onClick={() => setYearly(v as boolean)} aria-pressed={yearly === v} className={cn('rounded-full px-4 py-2 font-medium transition-colors', yearly === v ? 'bg-white text-ink' : 'text-white/60 hover:text-white')}>
                {l as string}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => {
            const price = yearly ? Math.round(p.monthly * 0.8) : p.monthly
            return (
              <Reveal key={p.id} delay={i * 0.06}>
                <div className={cn('relative flex h-full flex-col rounded-2xl border p-6', p.highlight ? 'border-brand/40 bg-gradient-to-b from-brand/[0.12] to-panel' : 'border-line bg-panel')}>
                  {p.highlight && (
                    <>
                      <BorderBeam />
                      <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-ink">MOST POPULAR</span>
                    </>
                  )}
                  <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/55">{p.blurb}</p>
                  <p className="mt-6">
                    <span className="font-display text-4xl font-extrabold text-white">{brand.currency}{price.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-white/50">/mo</span>
                  </p>
                  <p className="mt-1 h-4 text-xs text-white/40">{yearly ? `Billed yearly · ${brand.currency}${(price * 12).toLocaleString('en-IN')}` : 'Billed monthly'}</p>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-white/75"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{f}</li>
                    ))}
                  </ul>
                  <a href={p.id === 'partner' ? '#contact' : '#contact'} className={cn('mt-8 block rounded-full py-3 text-center text-sm font-semibold transition', p.highlight ? 'bg-brand text-ink hover:brightness-110' : 'border border-line text-white hover:bg-white/5')}>
                    {p.cta}
                  </a>
                </div>
              </Reveal>
            )
          })}
        </div>
        <p className="mt-6 text-center text-xs text-white/40">Prices exclude GST. WhatsApp message charges are set by Meta and passed through at cost.</p>
      </div>
    </section>
  )
}
