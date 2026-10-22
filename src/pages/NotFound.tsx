import { ArrowRight, BookOpen, Building2, MessageCircle, Scale, Wrench } from 'lucide-react'
import { brand } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { Spotlight } from '@/components/ui/spotlight'
import { GhostButton, ShimmerButton } from '@/components/ui/shimmer-button'

const places = [
  { icon: Scale, title: 'Compare', text: 'Aireplo vs Wati, AiSensy and Interakt', href: '/compare' },
  { icon: BookOpen, title: 'Guides', text: 'WhatsApp API setup and pricing in India', href: '/blog' },
  { icon: Building2, title: 'Industries', text: 'E-commerce, clinics, education, real estate', href: '/industries' },
  { icon: Wrench, title: 'Free tools', text: 'Link & QR generator, templates, formatter', href: '/tools' },
]

export function NotFound() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="font-display text-7xl font-extrabold text-brand/80 sm:text-8xl">404</p>
        <h1 className="font-display mt-4 text-3xl font-extrabold text-balance text-white sm:text-4xl">This page doesn’t exist</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/60">The link may be old or mistyped. Here are the most useful places to go next.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ShimmerButton href="/">Go to home <ArrowRight className="size-4" /></ShimmerButton>
          <GhostButton href={waLink(`Hi ${brand.name}, I was looking for something on your website.`)}>
            <MessageCircle className="size-4" /> Ask on WhatsApp
          </GhostButton>
        </div>
      </div>
      <div className="relative mx-auto mt-14 grid max-w-4xl gap-3 px-4 sm:grid-cols-2 sm:px-6">
        {places.map(({ icon: Icon, title, text, href }) => (
          <a key={href} href={href} className="group flex items-center gap-4 rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-brand/40">
            <Icon className="size-5 shrink-0 text-brand" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-left">
              <span className="block font-semibold text-white">{title}</span>
              <span className="block text-sm text-white/55">{text}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
          </a>
        ))}
      </div>
    </section>
  )
}
