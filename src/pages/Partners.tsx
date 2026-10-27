import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Briefcase, Building2, Check, Globe, Headphones, IndianRupee, Megaphone, Palette, Rocket, UserRound, Users } from 'lucide-react'
import { brand, inr, partner } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { Spotlight } from '@/components/ui/spotlight'
import { BorderBeam } from '@/components/ui/border-beam'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Reveal, SectionHeading } from '@/components/ui/section'
import { GhostButton, ShimmerButton } from '@/components/ui/shimmer-button'
import { Faq } from '@/sections/Faq'


function Slider({ id, label, value, min, max, step, onChange, format }: { id: string; label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-white/70">{label}</label>
        <span className="font-display text-xl font-bold text-white tabular-nums">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#22c55e]"
        style={{ background: `linear-gradient(to right, #22c55e ${pct}%, rgb(255 255 255 / 0.1) ${pct}%)` }}
      />
    </div>
  )
}

function Calculator() {
  const [clients, setClients] = useState(4)
  const [price, setPrice] = useState(49999)
  const margin = price - partner.perClientSetup
  const monthly = clients * margin
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0 space-y-8 rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <Slider id="clients" label="Clients you sign each month" value={clients} min={1} max={30} step={1} onChange={setClients} format={(v) => String(v)} />
        <Slider id="price" label="What you charge each client (one-time)" value={price} min={30000} max={150000} step={1000} onChange={setPrice} format={inr} />
        <div className="grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-3">
          <div className="flex justify-between gap-2 sm:block"><p className="text-white/50">You charge</p><p className="font-semibold text-white tabular-nums">{inr(price)}</p></div>
          <div className="flex justify-between gap-2 sm:block"><p className="text-white/50">You pay {brand.name}</p><p className="font-semibold text-white tabular-nums">{inr(partner.perClientSetup)}</p></div>
          <div className="flex justify-between gap-2 sm:block"><p className="text-white/50">You keep per client</p><p className="font-semibold text-brand tabular-nums">{inr(margin)}</p></div>
        </div>
        <p className="text-xs text-white/40">
          {brand.name} charges partners {inr(partner.perClientSetup)} one-time per client setup. Maintenance for each client is not included and is billed separately. Meta bills WhatsApp messages directly to your client.
        </p>
      </div>
      <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand/40 bg-gradient-to-b from-brand/[0.14] to-panel p-6 sm:p-8">
        <BorderBeam />
        <div>
          <p className="text-sm text-white/70">Your profit per month</p>
          <p className="font-display mt-2 text-5xl font-extrabold text-white tabular-nums">
            <NumberTicker value={monthly} prefix={brand.currency} />
          </p>
          <p className="mt-6 text-sm text-white/70">Every year</p>
          <p className="font-display mt-1 text-3xl font-bold text-brand tabular-nums">{inr(monthly * 12)}</p>
        </div>
        <a href={waLink(`Hi! I want to become an ${brand.name} partner. I plan to sign ${clients} clients a month at ${inr(price)} each.`)} target="_blank" rel="noreferrer" className="mt-8 block rounded-full bg-brand py-3 text-center text-sm font-semibold text-ink hover:brightness-110">
          Apply with these numbers
        </a>
      </div>
    </div>
  )
}

const gets = [
  { icon: Palette, title: 'Your brand everywhere', body: 'Logo, colors, favicon, login page, emails and invoices carry your name only.' },
  { icon: Globe, title: 'Your own domain', body: 'Run the platform on app.youragency.com with free SSL.' },
  { icon: IndianRupee, title: 'Your prices, your profit', body: 'Charge clients any price you choose and bill them directly. We never contact your clients.' },
  { icon: Users, title: 'Client management panel', body: 'Create client workspaces, set their modules and limits, and switch between them in one click.' },
  { icon: Headphones, title: 'We support you, you support clients', body: 'A dedicated launch manager, partner WhatsApp group, and help with Meta verification.' },
  { icon: Megaphone, title: 'Sales kit included', body: 'Ready-made pitch deck, demo videos and proposal templates with your branding.' },
]

const who = [
  { icon: Megaphone, title: 'Digital marketing agencies', body: 'Add WhatsApp marketing to every retainer and keep clients longer.' },
  { icon: Briefcase, title: 'Software resellers & IT firms', body: 'Add a high-demand SaaS product to your catalog without building it.' },
  { icon: UserRound, title: 'Freelancers & consultants', body: 'Sell complete WhatsApp setups to your clients without building anything yourself.' },
  { icon: Building2, title: 'Franchises & business groups', body: 'Give every outlet its own workspace under one brand.' },
]

const steps = [
  ['Apply & get approved', 'Share your agency details. We reply within 24 hours.'],
  ['We set up your platform', 'Your domain, logo and colors, ready within a few working days.'],
  ['Onboard your first client', 'We join your first client call and handle Meta setup with you.'],
  ['Earn on every client', 'You pay a fixed setup fee per client and keep the rest.'],
]

export const partnerFaqs: [string, string][] = [
  [`Will my clients ever see the ${brand.name} name?`, 'No. The dashboard, login page, emails, invoices and domain all show your brand. We never contact your clients directly.'],
  ['Who handles Meta verification for my clients?', 'We do it together. Our team handles the technical setup and helps your client through Meta business verification.'],
  ['How do I bill my clients?', 'You bill them directly, at any price you like. You pay us only the one-time setup fee per client.'],
  ['Is there a monthly partner fee?', `No. You pay ${inr(partner.perClientSetup)} one-time for each client we set up. Maintenance for each client is not included and is billed separately.`],
  ['Can I ask for custom features for a client?', 'Yes. Share the requirement and we’ll quote a custom module or integration, delivered under your brand.'],
]

export function Partners() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand">
            <Rocket className="size-3.5" /> White-label partner program
          </p>
          <h1 className="font-display mt-6 text-[2.5rem] leading-[1.03] font-extrabold text-white sm:text-7xl">
            Sell <span className="bg-gradient-to-r from-brand via-emerald-300 to-brand-2 bg-clip-text text-transparent">white-label WhatsApp</span> under your own brand.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/65 sm:text-lg">
            Sell complete WhatsApp setups under your agency’s name. We build each client’s Meta app and branded dashboard; you set the price and keep the profit.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ShimmerButton href="#earn">Calculate your earnings <ArrowRight className="size-4" /></ShimmerButton>
            <GhostButton href={waLink(`Hi! I want to know more about the ${brand.name} partner program.`)} target="_blank" rel="noreferrer">Talk to partner team</GhostButton>
          </div>
        </motion.div>
      </section>

      <section id="earn" className="scroll-mt-20 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Earnings calculator" title="See what you could earn" sub="Move the sliders. One-time pricing per client, no monthly partner fee." />
          <div className="mt-12"><Calculator /></div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="What you get" title="Everything you need to sell" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gets.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-panel p-6">
                  <g.icon className="size-5 text-brand" />
                  <h3 className="mt-4 font-semibold text-white">{g.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Who it’s for" title="Built for people who serve businesses" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {who.map((w) => (
              <div key={w.title} className="flex gap-4 rounded-2xl border border-line bg-panel p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand"><w.icon className="size-5" /></span>
                <div>
                  <h3 className="font-semibold text-white">{w.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{w.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="How it works" title="From sign-up to first client" />
          <ol className="mt-12 space-y-4">
            {steps.map(([t, b], i) => (
              <li key={t} className="flex gap-5 rounded-2xl border border-line bg-panel p-5">
                <span className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold text-ink">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-white">{t}</h3>
                  <p className="mt-1 text-sm text-white/60">{b}</p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="mt-10 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
            {['No monthly partner fee', 'Pay per client', 'No lock-in'].map((t) => (
              <li key={t} className="flex items-center justify-center gap-2"><Check className="size-4 text-brand" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={partnerFaqs} title="Partner questions" />

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">Ready to launch your brand?</h2>
          <p className="mt-4 text-white/60">Message us on WhatsApp. You’ll get a branded demo of your own platform within 24 hours.</p>
          <div className="mt-8 flex justify-center">
            <ShimmerButton href={waLink(`Hi! I want to become an ${brand.name} white-label partner. My agency name is: `)} target="_blank" rel="noreferrer">
              Apply on WhatsApp <ArrowRight className="size-4" />
            </ShimmerButton>
          </div>
        </div>
      </section>
    </>
  )
}
