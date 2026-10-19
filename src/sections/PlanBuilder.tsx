import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { brand, modules } from '@/brand'
import { SectionHeading } from '@/components/ui/section'
import { NumberTicker } from '@/components/ui/number-ticker'
import { BorderBeam } from '@/components/ui/border-beam'
import { cn } from '@/lib/utils'

const BASE = 499

export function PlanBuilder() {
  const [picked, setPicked] = useState<string[]>(['inbox', 'broadcast', 'bot'])
  const [numbers, setNumbers] = useState(1)
  const total = useMemo(
    () => BASE + modules.filter((m) => picked.includes(m.id)).reduce((a, m) => a + m.price, 0) + (numbers - 1) * 299,
    [picked, numbers],
  )
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const summary = modules.filter((m) => picked.includes(m.id)).map((m) => m.name).join(', ')
  const wa = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hi! I'd like a plan with: ${summary}. WhatsApp numbers: ${numbers}. Estimated ${brand.currency}${total}/mo.`)}`

  return (
    <section id="builder" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Build your plan" title="Pay for what you use. Nothing else." sub="Pick modules and watch the price update. Send it to us and we’ll set it up." />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {modules.map((m) => {
              const on = picked.includes(m.id)
              const req = 'required' in m && m.required
              return (
                <button
                  key={m.id}
                  disabled={req}
                  onClick={() => toggle(m.id)}
                  aria-pressed={on}
                  className={cn(
                    'flex items-center justify-between rounded-xl border p-4 text-left transition-colors',
                    on ? 'border-brand/50 bg-brand/[0.08]' : 'border-line bg-panel hover:border-white/20',
                    req && 'cursor-default',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn('grid size-5 place-items-center rounded-md border', on ? 'border-brand bg-brand text-ink' : 'border-white/25')}>
                      {on && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className="text-sm font-medium text-white">{m.name}</span>
                  </span>
                  <span className="text-xs text-white/50">{m.price === 0 ? 'Included' : `+${brand.currency}${m.price}`}</span>
                </button>
              )
            })}
            <div className="flex items-center justify-between rounded-xl border border-line bg-panel p-4 sm:col-span-2">
              <span className="text-sm font-medium text-white">WhatsApp numbers <span className="text-white/45">(+{brand.currency}299 each extra)</span></span>
              <span className="flex items-center gap-3">
                <button onClick={() => setNumbers((n) => Math.max(1, n - 1))} className="size-8 rounded-lg border border-line text-white hover:bg-white/5" aria-label="Fewer numbers">−</button>
                <span className="w-5 text-center font-semibold text-white">{numbers}</span>
                <button onClick={() => setNumbers((n) => Math.min(10, n + 1))} className="size-8 rounded-lg border border-line text-white hover:bg-white/5" aria-label="More numbers">+</button>
              </span>
            </div>
          </div>
          <div className="relative flex flex-col rounded-2xl border border-line bg-panel p-6">
            <BorderBeam duration={7} />
            <p className="text-sm text-white/60">Your estimated price</p>
            <p className="font-display mt-2 text-5xl font-extrabold text-white">
              <NumberTicker value={total} prefix={brand.currency} />
              <span className="text-lg font-medium text-white/50">/mo</span>
            </p>
            <p className="mt-2 text-xs text-white/45">Platform fee only. Meta’s message charges are billed at cost — 0% markup.</p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li className="flex gap-2"><Check className="size-4 text-brand" /> Unlimited team members</li>
              <li className="flex gap-2"><Check className="size-4 text-brand" /> Free setup & Meta verification</li>
              <li className="flex gap-2"><Check className="size-4 text-brand" /> Add or remove modules any time</li>
            </ul>
            <a href={wa} target="_blank" rel="noreferrer" className="mt-auto pt-8">
              <span className="block rounded-full bg-brand py-3 text-center text-sm font-semibold text-ink transition hover:brightness-110">Send this plan on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
