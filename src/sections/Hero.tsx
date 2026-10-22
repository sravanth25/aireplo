import { DemoPlayer } from '@/components/DemoPlayer'
import { motion } from 'motion/react'
import { ArrowRight, BadgeCheck, Play } from 'lucide-react'
import { brand, inr, packages } from '@/brand'
import { Spotlight } from '@/components/ui/spotlight'
import { BorderBeam } from '@/components/ui/border-beam'
import { GhostButton, ShimmerButton } from '@/components/ui/shimmer-button'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <a href="#white-label" className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand">
            <BadgeCheck className="size-3.5" /> Official WhatsApp Business API · White-label ready
          </a>
          <h1 className="font-display mt-6 text-[2.6rem] leading-[1.02] font-extrabold text-white sm:text-7xl">
            WhatsApp Business API,{' '}
            <span className="bg-gradient-to-r from-brand via-emerald-300 to-brand-2 bg-clip-text text-transparent">under your brand.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/65 sm:text-lg">
            Broadcasts, shared inbox, no-code chatbots and an AI agent — delivered as a dashboard with <b className="text-white">your logo, your colors, your domain</b>. We set up everything, from Facebook to your own Meta app, and you <b className="text-white">pay once</b>.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ShimmerButton href="#contact">Get your branded dashboard <ArrowRight className="size-4" /></ShimmerButton>
            <GhostButton href="#pricing">See packages — one-time from {inr(packages[0].price)}</GhostButton>
          </div>
          <p className="mt-4 text-xs text-white/40">One-time payment · No monthly subscription · You own your Meta app & data</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mx-auto mt-14 max-w-5xl [perspective:1200px]"
        >
          <div className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-full bg-brand/20 blur-[100px]" />
          <div className="relative overflow-hidden rounded-2xl border border-line bg-panel p-1.5 shadow-2xl shadow-black/60 sm:rounded-3xl sm:p-2">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="ml-3 hidden items-center gap-1.5 text-[11px] text-white/35 sm:flex"><Play className="size-3" /> Live product demo — rendered with Remotion</span>
            </div>
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <DemoPlayer inputProps={{ brandName: brand.name, color: '#22c55e' }} />
            </div>
            <BorderBeam />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
