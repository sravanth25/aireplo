import { Check, Minus } from 'lucide-react'
import { brand } from '@/brand'
import { SectionHeading } from '@/components/ui/section'

const rows: [string, string, string][] = [
  ['Markup on Meta message charges', '0%', 'Often added'],
  ['Team members', 'Unlimited', 'Per-seat on many plans'],
  ['AI agent', 'Included from Growth', 'Usually a paid add-on'],
  ['White-label (your logo & domain)', 'Yes', 'Rare or enterprise-only'],
  ['Pick only the modules you need', 'Yes', 'Fixed bundles'],
  ['Custom features on request', 'Yes', 'Rarely'],
  ['Setup fee', `${brand.currency}0`, 'Varies'],
]

export function Compare() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow="Why switch" title={`${brand.name} vs typical WhatsApp platforms`} />
        <div className="mt-12 overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/60">
              <tr>
                <th className="p-4 font-medium" scope="col"><span className="sr-only">Feature</span></th>
                <th className="p-4 font-semibold text-brand" scope="col">{brand.name}</th>
                <th className="p-4 font-medium" scope="col">Typical platforms</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([f, us, them]) => (
                <tr key={f} className="border-t border-line">
                  <th scope="row" className="p-4 font-medium text-white/85">{f}</th>
                  <td className="p-4 text-white"><span className="inline-flex items-center gap-2"><Check className="size-4 shrink-0 text-brand" />{us}</span></td>
                  <td className="p-4 text-white/50"><span className="inline-flex items-center gap-2"><Minus className="size-4 shrink-0" />{them}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
