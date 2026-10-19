import { Bot, Megaphone, MessagesSquare, Sparkles, ShoppingBag, BarChart3, Target, Webhook } from 'lucide-react'
import { Reveal, SectionHeading } from '@/components/ui/section'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

function Card({ icon: Icon, title, body, className, children }: { icon: typeof Bot; title: string; body: string; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('group relative h-full overflow-hidden rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-brand/30', className)}>
      <div className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-brand/0 blur-3xl transition-colors duration-500 group-hover:bg-brand/15" />
      <Icon className="size-5 text-brand" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{body}</p>
      {children}
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Everything in one place" title="All the tools. None of the bloat." sub="Every feature the big platforms have — switch each one on only when you need it." />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <Card icon={Megaphone} title="Broadcasts that convert" body="Send personalised offers to thousands in one click. Schedule, segment by tags, retarget people who clicked but didn’t buy.">
              <div className="mt-6 flex flex-wrap gap-2">
                {['Segments', 'Scheduling', 'A/B templates', 'Retargeting', 'Carousel messages'].map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/70">{t}</span>
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal delay={0.05}>
            <Card icon={MessagesSquare} title="Shared team inbox" body="Unlimited agents on every plan. Auto-assign chats, add notes, and see who replied last." />
          </Reveal>
          <Reveal>
            <Card icon={Bot} title="No-code chatbots" body="Drag-and-drop flows for FAQs, lead capture, order tracking and bookings." />
          </Reveal>
          <Reveal delay={0.05} className="md:col-span-2">
            <Card icon={Sparkles} title="AI agent trained on your business" body="Upload your catalog, FAQs or website. The AI agent answers in Hindi, English and 10+ Indian languages, and hands over to a human when needed.">
              <div className="mt-6 space-y-2 text-sm">
                <div className="w-fit rounded-xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-white/80">Kya ye shoe 9 size mein milega?</div>
                <div className="ml-auto w-fit rounded-xl rounded-tr-sm bg-brand/20 px-3 py-2 text-white">✨ Haan! Size 9 stock mein hai. Aaj order karein, kal delivery 🚚</div>
              </div>
            </Card>
          </Reveal>
          <Reveal>
            <Card icon={ShoppingBag} title="Catalog & payments" body="Show products, take orders and collect payments inside the chat." />
          </Reveal>
          <Reveal delay={0.05}>
            <Card icon={Target} title="Click-to-WhatsApp ads" body="Track which Meta ad brought each chat and sale." />
          </Reveal>
          <Reveal delay={0.1}>
            <Card icon={BarChart3} title="Analytics that matter" body="Revenue per campaign, agent response times, read and click rates." />
          </Reveal>
          <Reveal className="md:col-span-3">
            <Card icon={Webhook} title="Open API & webhooks" body="Connect any CRM, ERP or custom app. Send OTPs, order updates and alerts from your own systems." className="md:flex md:items-center md:gap-8 [&>h3]:mt-0" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
