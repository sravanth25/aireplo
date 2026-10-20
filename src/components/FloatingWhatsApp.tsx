import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'
import { brand } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { AireploMark } from '@/components/AireploMark'

const quick = [
  'Hi! I want a free demo of Aireplo',
  'Hi! I have a question about pricing',
  'Hi! I want to become a white-label partner',
]

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="fixed z-50 flex flex-col items-end gap-3"
      style={{ right: 'calc(1.25rem + env(safe-area-inset-right, 0px))', bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl shadow-black/60"
            role="dialog"
            aria-label={`Chat with ${brand.name} on WhatsApp`}
          >
            <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3">
              <AireploMark className="size-10" />
              <div>
                <p className="text-sm font-semibold text-white">{brand.name} team</p>
                <p className="text-xs text-white/70">Typically replies in a few minutes</p>
              </div>
            </div>
            <div className="space-y-3 bg-[#0b141a] p-4">
              <div className="w-fit max-w-[85%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 py-2 text-sm text-white">
                Hi there 👋 How can we help you grow on WhatsApp?
              </div>
              <div className="flex flex-col gap-2 pt-1">
                {quick.map((q) => (
                  <a key={q} href={waLink(q)} target="_blank" rel="noreferrer" className="rounded-xl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-white transition-colors hover:bg-brand/20">
                    {q.replace('Hi! ', '')}
                  </a>
                ))}
              </div>
              <a href={waLink('Hi!')} target="_blank" rel="noreferrer" className="block rounded-full bg-brand py-2.5 text-center text-sm font-semibold text-ink hover:brightness-110">
                Start chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Chat with us on WhatsApp'}
        className="relative grid size-14 place-items-center rounded-full bg-brand text-ink shadow-lg shadow-brand/40 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-duration:2.5s]" />}
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  )
}
