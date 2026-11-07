import { Building2, Check, Info, Plus } from 'lucide-react'
import { enterprise, extras, featurePrice, inr, plan, pricingNote } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { Reveal, SectionHeading } from '@/components/ui/section'
import { BorderBeam } from '@/components/ui/border-beam'

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="One package. Pay once. Own it."
          sub={`Everything you need to start, for ${inr(plan.price)}. Need more? Each extra feature is just ${inr(featurePrice)}.`}
        />

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* the package */}
          <Reveal>
            <div className="relative flex h-full flex-col rounded-2xl border border-brand/40 bg-gradient-to-b from-brand/[0.12] to-panel p-6">
              <BorderBeam />
              <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-ink">EVERYTHING TO START</span>
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-white/55">{plan.for}</p>
              <p className="mt-6 font-display text-5xl font-extrabold text-white tabular-nums">{inr(plan.price)}</p>
              <p className="mt-1 text-xs font-medium text-brand">{pricingNote.short}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-white/75"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{f}</li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <a
                  href={waLink(`Hi! I'm interested in the ${plan.name} (${inr(plan.price)} one-time).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-full bg-brand py-3 text-center text-sm font-semibold text-ink transition hover:brightness-110"
                >
                  Get started
                </a>
                <a href={`/pay?plan=${plan.id}`} className="mt-2.5 block text-center text-xs text-white/45 hover:text-white">
                  Already confirmed? <span className="underline underline-offset-2">Pay now by UPI</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* extra features */}
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-panel p-6">
              <div className="flex items-center gap-2">
                <Plus className="size-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">Extra features</h3>
              </div>
              <p className="mt-1 text-sm text-white/55">Add only what you need</p>
              <p className="mt-6 font-display text-5xl font-extrabold text-white tabular-nums">{inr(featurePrice)}</p>
              <p className="mt-1 text-xs font-medium text-brand">Per feature · One-time</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {extras.map((e) => (
                  <li key={e.id} className="flex gap-2.5 text-white/75">
                    <Plus className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{e.name}{e.unit && <span className="text-white/40"> (per {e.unit})</span>}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <a href="#estimator" className="block rounded-full border border-line py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5">
                  Build your price
                </a>
              </div>
            </div>
          </Reveal>

          {/* enterprise */}
          <Reveal delay={0.12}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-[#0b0f14] p-6">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">{enterprise.name}</h3>
              </div>
              <p className="mt-1 text-sm text-white/55">{enterprise.for}</p>
              <p className="mt-6 font-display text-5xl font-extrabold text-white">Custom</p>
              <p className="mt-1 text-xs font-medium text-brand">Priced for your project · One-time</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {enterprise.features.map((f) => (
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
      </div>
    </section>
  )
}
