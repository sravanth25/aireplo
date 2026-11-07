import { useMemo, useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { extras, featurePrice, inr, plan, pricingNote } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { SectionHeading } from '@/components/ui/section'
import { NumberTicker } from '@/components/ui/number-ticker'
import { BorderBeam } from '@/components/ui/border-beam'
import { cn } from '@/lib/utils'

export function Estimator() {
  const [on, setOn] = useState<Record<string, boolean>>({})
  const [qty, setQty] = useState<Record<string, number>>({})

  const lines = useMemo(() => {
    const out: { name: string; price: number }[] = [{ name: plan.name, price: plan.price }]
    for (const e of extras) {
      if (e.unit) {
        const n = qty[e.id] ?? 0
        if (n > 0) out.push({ name: `${e.name} × ${n}`, price: featurePrice * n })
      } else if (on[e.id]) {
        out.push({ name: e.name, price: featurePrice })
      }
    }
    return out
  }, [on, qty])
  const total = lines.reduce((s, l) => s + l.price, 0)

  const message = `Hi! I'd like a quote for:\n${lines.map((l) => `• ${l.name}: ${inr(l.price)}`).join('\n')}\nEstimated total: ${inr(total)} one-time`

  return (
    <section id="estimator" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Price builder"
          title="See your price before we talk"
          sub={`Start with the ${inr(plan.price)} package, add the features you need at ${inr(featurePrice)} each, and send it to us on WhatsApp.`}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-brand/60 bg-brand/[0.08] p-4">
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-md border border-brand bg-brand text-ink"><Check className="size-3.5" strokeWidth={3} /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{plan.name}</span>
                  <span className="block text-xs text-white/50">Setup, your own Meta app, 1 number, branded inbox & broadcasts, 5 templates, 30 days support</span>
                </span>
              </span>
              <span className="shrink-0 text-lg font-bold text-white tabular-nums">{inr(plan.price)}</span>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-medium text-white/70">Add extra features: {inr(featurePrice)} each</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {extras.map((e) => {
                  if (e.unit) {
                    const n = qty[e.id] ?? 0
                    return (
                      <div key={e.id} className={cn('flex items-center justify-between gap-3 rounded-xl border p-4', n > 0 ? 'border-brand/50 bg-brand/[0.08]' : 'border-line bg-panel')}>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-white">{e.name}</span>
                          <span className="text-xs text-white/50">+{inr(featurePrice)} per {e.unit}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <button onClick={() => setQty((q) => ({ ...q, [e.id]: Math.max(0, n - 1) }))} className="grid size-8 place-items-center rounded-lg border border-line text-white hover:bg-white/5 disabled:opacity-30" disabled={n === 0} aria-label={`Fewer: ${e.name}`}><Minus className="size-3.5" /></button>
                          <span className="w-5 text-center font-semibold text-white tabular-nums">{n}</span>
                          <button onClick={() => setQty((q) => ({ ...q, [e.id]: Math.min(20, n + 1) }))} className="grid size-8 place-items-center rounded-lg border border-line text-white hover:bg-white/5" aria-label={`More: ${e.name}`}><Plus className="size-3.5" /></button>
                        </span>
                      </div>
                    )
                  }
                  const checked = !!on[e.id]
                  return (
                    <button
                      key={e.id}
                      onClick={() => setOn((o) => ({ ...o, [e.id]: !o[e.id] }))}
                      aria-pressed={checked}
                      className={cn('flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors', checked ? 'border-brand/50 bg-brand/[0.08]' : 'border-line bg-panel hover:border-white/20')}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className={cn('grid size-5 shrink-0 place-items-center rounded-md border', checked ? 'border-brand bg-brand text-ink' : 'border-white/25')}>
                          {checked && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                        <span className="text-sm font-medium text-white">{e.name}</span>
                      </span>
                      <span className="shrink-0 text-xs text-white/50">+{inr(featurePrice)}</span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-white/40">Need something not listed? Tell us on WhatsApp and we’ll quote it.</p>
            </fieldset>
          </div>

          <div className="relative flex flex-col rounded-2xl border border-line bg-panel p-6">
            <BorderBeam duration={7} />
            <p className="text-sm text-white/60">Your estimate</p>
            <p className="font-display mt-2 text-5xl font-extrabold text-white tabular-nums">
              <NumberTicker value={total} prefix="₹" />
            </p>
            <p className="mt-1 text-xs font-medium text-brand">{pricingNote.short}</p>
            <ul className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
              {lines.map((l) => (
                <li key={l.name} className="flex justify-between gap-3 text-white/70">
                  <span className="min-w-0">{l.name}</span>
                  <span className="shrink-0 tabular-nums text-white">{inr(l.price)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-white/45">Maintenance after handover is not included and is billed separately. Meta bills WhatsApp messages directly to your account.</p>
            <a href={waLink(message)} target="_blank" rel="noreferrer" className="mt-auto block pt-6">
              <span className="block rounded-full bg-brand py-3 text-center text-sm font-semibold text-ink transition hover:brightness-110">Send this estimate on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
