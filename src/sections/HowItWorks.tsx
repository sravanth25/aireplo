import { ClipboardList, Palette, Rocket } from 'lucide-react'
import { Reveal, SectionHeading } from '@/components/ui/section'

export const steps = [
  { icon: ClipboardList, title: 'Tell us what you need', body: 'Pick a package and add what you need: inbox, broadcasts, AI agent, chatbots, integrations. We quote a fixed one-time price.' },
  { icon: Palette, title: 'We build it for you', body: 'We set up your Facebook Business, build your own Meta app, connect your WhatsApp number and brand your dashboard.' },
  { icon: Rocket, title: 'Go live and own it', body: 'Most brands are live within 5 working days. We train your team and hand over full ownership.' },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="How it works" title="Built around your requirements" sub="Other platforms rent you a fixed product. We build yours and hand you the keys." />
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
