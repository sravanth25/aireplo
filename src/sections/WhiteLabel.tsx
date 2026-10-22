import { Player } from '@remotion/player'
import { ClientOnly } from '@/components/ClientOnly'
import { useDeferredValue, useState } from 'react'
import { Check, Globe, Mail, LogIn, Users } from 'lucide-react'
import { ProductDemo, DEMO } from '@/remotion/ProductDemo'
import { SectionHeading } from '@/components/ui/section'
import { cn } from '@/lib/utils'

const swatches = ['#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ef4444', '#eab308', '#14b8a6', '#ec4899']

export function WhiteLabel() {
  const [name, setName] = useState('Your Brand')
  const [color, setColor] = useState('#3b82f6')
  const props = useDeferredValue({ brandName: name, color })
  return (
    <section id="white-label" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="White-label studio"
          title={<>See it with <span className="text-brand">your</span> brand — right now</>}
          sub="Type your business name and pick a color. The dashboard below rebrands live."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <label htmlFor="bn" className="text-sm font-medium text-white/80">Business name</label>
            <input
              id="bn"
              value={name}
              maxLength={18}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-brand/60"
              placeholder="Your Brand"
            />
            <p className="mt-6 text-sm font-medium text-white/80">Brand color</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {swatches.map((s) => (
                <button
                  key={s}
                  onClick={() => setColor(s)}
                  aria-label={`Use color ${s}`}
                  className={cn('grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-panel transition', color === s && 'ring-2 ring-white')}
                  style={{ background: s }}
                >
                  {color === s && <Check className="size-4 text-black/70" />}
                </button>
              ))}
              <label className="relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-white/30 text-xs text-white/60" title="Custom color">
                +
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Custom color" />
              </label>
            </div>
            <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-white/70">
              <li className="flex gap-3"><Globe className="size-4 shrink-0 text-brand" /> Your own domain (app.yourbrand.com)</li>
              <li className="flex gap-3"><LogIn className="size-4 shrink-0 text-brand" /> Branded login & signup pages</li>
              <li className="flex gap-3"><Mail className="size-4 shrink-0 text-brand" /> Emails & invoices sent in your name</li>
              <li className="flex gap-3"><Users className="size-4 shrink-0 text-brand" /> Resell to your own clients at your price</li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-panel p-1.5">
            <div className="overflow-hidden rounded-xl">
              <ClientOnly fallback={<div className="w-full bg-[#070a0e]" style={{ aspectRatio: `${DEMO.width} / ${DEMO.height}` }} />}>
                <Player
                  component={ProductDemo}
                  inputProps={props}
                  durationInFrames={DEMO.durationInFrames}
                  compositionWidth={DEMO.width}
                  compositionHeight={DEMO.height}
                  fps={DEMO.fps}
                  autoPlay
                  loop
                  acknowledgeRemotionLicense
                  style={{ width: '100%', aspectRatio: `${DEMO.width} / ${DEMO.height}` }}
                />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
