import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function SectionHeading({ eyebrow, title, sub, className }: { eyebrow: string; title: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={cn('mx-auto max-w-2xl text-center', className)}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-base text-white/60 sm:text-lg">{sub}</p>}
    </motion.div>
  )
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
