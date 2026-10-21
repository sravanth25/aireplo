import { Check, Minus } from 'lucide-react'
import { brand } from '@/brand'
import { SectionHeading } from '@/components/ui/section'

const rows: [string, string, string][] = [
  ['How you pay', 'One-time project fee', 'Monthly subscription, forever'],
  ['Who owns the Meta app & WhatsApp account', 'You do', 'The platform'],
  ['WhatsApp message charges', 'Billed by Meta to you, at Meta’s rates', 'Often marked up'],
  ['If you stop paying', 'You keep your Meta app, number and data', 'You lose access'],
  ['Setup (Facebook, Meta app, verification)', 'Done for you', 'Do it yourself or pay extra'],
  ['Your logo & domain', 'Included', 'Rare or enterprise-only'],
  ['Team members', 'Unlimited', 'Per-seat on many plans'],
  ['Custom features', 'Built on request', 'Rarely'],
]

export function Compare() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow="Why switch" title="Stop renting. Start owning." sub={`What you get with ${brand.name}, compared with typical WhatsApp platforms.`} />
        <div className="mt-12 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-white/[0.03] text-white/60">
              <tr>
                <th className="p-4 font-medium" scope="col"><span className="sr-only">Topic</span></th>
                <th className="p-4 font-semibold text-brand" scope="col">{brand.name} · you own it</th>
                <th className="p-4 font-medium" scope="col">Typical platforms · you rent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([f, us, them]) => (
                <tr key={f} className="border-t border-line">
                  <th scope="row" className="p-4 font-medium text-white/85">{f}</th>
                  <td className="p-4 text-white"><span className="inline-flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{us}</span></td>
                  <td className="p-4 text-white/50"><span className="inline-flex items-start gap-2"><Minus className="mt-0.5 size-4 shrink-0" />{them}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
