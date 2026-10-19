import { useState } from 'react'
import { Plus } from 'lucide-react'
import { brand } from '@/brand'
import { SectionHeading } from '@/components/ui/section'
import { cn } from '@/lib/utils'

const faqs: [string, string][] = [
  ['Is this the official WhatsApp Business API?', 'Yes. Your number is connected through Meta’s official Cloud API, so you get the green-tick eligibility, high sending limits and no risk of bans from unofficial tools.'],
  ['What does “white-label” mean here?', `Your dashboard shows your logo, colors and domain. Your clients never see the ${brand.name} name. Agencies can resell it at their own price.`],
  ['How do Meta message charges work?', 'Meta charges per message by category (marketing, utility, authentication). We pass these through at exactly Meta’s rate — no markup. You only add our flat platform fee.'],
  ['Can I ask for a feature that isn’t listed?', 'Yes. Share your requirements and we’ll quote custom modules, integrations or flows built specifically for your business.'],
  ['How long does setup take?', 'Most accounts are live within 48 hours, including Meta verification, number connection and your first message templates.'],
  ['Can I cancel any time?', 'Yes. Monthly plans can be cancelled any time. Your contacts and chat history can be exported.'],
]

export function Faq({ items = faqs, title = 'Questions, answered' }: { items?: [string, string][]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title={title} />
        <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-panel">
          {items.map(([q, a], i) => (
            <div key={q}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-white">
                {q}
                <Plus className={cn('size-4 shrink-0 text-brand transition-transform', open === i && 'rotate-45')} />
              </button>
              <div className={cn('grid transition-all duration-300', open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                <p className="overflow-hidden px-5 text-sm leading-relaxed text-white/60"><span className="block pb-5">{a}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
