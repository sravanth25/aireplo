import { ArrowRight, Building2, Check, Info, Wrench } from 'lucide-react'
import { enterprise, inr, packages, pricingNote, setupOnly } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { Reveal, SectionHeading } from '@/components/ui/section'
import { BorderBeam } from '@/components/ui/border-beam'
import { cn } from '@/lib/utils'

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Packages"
          title="Pay once. Own it."
          sub="No monthly subscription. We set up everything, from Facebook to your own Meta app, and hand you the keys."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <div className={cn('relative flex h-full flex-col rounded-2xl border p-6', p.highlight ? 'border-brand/40 bg-gradient-to-b from-brand/[0.12] to-panel' : 'border-line bg-panel')}>
                {p.highlight && (
                  <>
                    <BorderBeam />
                    <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-ink">MOST POPULAR</span>
                  </>
                )}
                <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-white/55">{p.for}</p>
                <p className="mt-6 font-display text-4xl font-extrabold text-white tabular-nums">{inr(p.price)}</p>
                <p className="mt-1 text-xs font-medium text-brand">{pricingNote.short}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-white/75"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{f}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <a
                    href={waLink(`Hi! I'm interested in the ${p.name} package (${inr(p.price)} one-time).`)}
                    target="_blank"
                    rel="noreferrer"
                    className={cn('block rounded-full py-3 text-center text-sm font-semibold transition', p.highlight ? 'bg-brand text-ink hover:brightness-110' : 'border border-line text-white hover:bg-white/5')}
                  >
                    Get {p.name}
                  </a>
                  <a href={`/pay?plan=${p.id}`} className="mt-2.5 block text-center text-xs text-white/45 hover:text-white">
                    Already confirmed? <span className="underline underline-offset-2">Pay now by UPI</span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.18}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-[#0b0f14] p-6">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">{enterprise.name}</h3>
              </div>
              <p className="mt-1 text-sm text-white/55">{enterprise.for}</p>
              <p className="mt-6 font-display text-4xl font-extrabold text-white">Custom</p>
              <p className="mt-1 text-xs font-medium text-brand">Priced for your project · One-time</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {enterprise.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex gap-2.5 text-white/75"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{f}</li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <a href="#enterprise" className="block rounded-full border border-line py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5">
                  Talk to us
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* common point for every price */}
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/[0.06] p-4 text-sm text-white/75">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
          <p>
            <b className="text-white">One-time charges, maintenance not included.</b> {pricingNote.full.replace('All prices are one-time charges. ', '')} {pricingNote.meta}
          </p>
        </div>

        {/* entry offer */}
        <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-line bg-panel p-6 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand"><Wrench className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">
              Only need the WhatsApp API set up? <span className="text-brand">{setupOnly.name}: {inr(setupOnly.price)}</span> <span className="text-sm font-normal text-white/50">one-time</span>
            </p>
            <p className="mt-1 text-sm text-white/55">{setupOnly.features.join(' · ')}. No dashboard; upgrade to a package any time.</p>
          </div>
          <a href={waLink(`Hi! I'd like the ${setupOnly.name} (${inr(setupOnly.price)} one-time).`)} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5">
            Get setup <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
