import { ClipboardList, Palette, Rocket } from 'lucide-react'
import { Reveal, SectionHeading } from '@/components/ui/section'

const steps = [
  { icon: ClipboardList, title: 'Tell us what you need', body: 'Pick modules — inbox, broadcasts, chatbots, AI agent, catalog, CRM. Skip what you don’t use, and don’t pay for it.' },
  { icon: Palette, title: 'We brand it for you', body: 'Your logo, colors, login page and domain. Your customers and team only ever see your name.' },
  { icon: Rocket, title: 'Go live in 48 hours', body: 'We handle Meta verification, number setup and templates, then train your team on a call.' },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="How it works" title="Built around your requirements" sub="Other platforms sell one fixed product. We assemble the dashboard you asked for." />
        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="absolute top-9 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-line bg-panel p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand"><s.icon className="size-5" /></span>
                  <span className="font-display text-sm font-bold text-white/30">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
