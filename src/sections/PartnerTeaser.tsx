import { ArrowRight, IndianRupee } from 'lucide-react'
import { brand } from '@/brand'
import { Reveal } from '@/components/ui/section'

export function PartnerTeaser() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <a href="#partners" className="group flex flex-col items-start gap-6 rounded-3xl border border-brand/30 bg-gradient-to-r from-brand/[0.14] via-panel to-panel p-8 transition-colors hover:border-brand/60 sm:flex-row sm:items-center sm:p-10">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-ink"><IndianRupee className="size-6" /></span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">For agencies & resellers</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">Sell {brand.name} as your own product</h2>
              <p className="mt-2 text-white/60">Your brand, your prices, your clients. See how much you could earn every month.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">
              Partner program <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
