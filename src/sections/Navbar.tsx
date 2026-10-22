import { Logo } from '@/components/Logo'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Page } from '@/lib/router'

const links = [
  ['Features', '/#features'],
  ['White-label', '/#white-label'],
  ['Pricing', '/#pricing'],
  ['Enterprise', '/#enterprise'],
  ['Partners', '/partners'],
  ['Free tools', '/tools'],
  ['Guides', '/blog'],
]

export function Navbar({ page }: { page: Page }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-colors', scrolled || open ? 'border-b border-line bg-ink/80 backdrop-blur-xl' : 'bg-transparent')}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} aria-current={h === '/' + page || (page === 'content' && h === '/blog') ? 'page' : undefined} className={cn('text-sm transition-colors hover:text-white', h === '/' + page ? 'text-white' : 'text-white/65')}>{l}</a>
          ))}
        </div>
        <div className="hidden md:block">
          <ShimmerButton href="/#contact" className="px-5 py-2.5">Share requirements</ShimmerButton>
        </div>
        <button className="rounded-lg p-2 text-white md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-line px-4 pb-6 pt-2 md:hidden">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="block py-3 text-white/80">{l}</a>
          ))}
          <ShimmerButton href="/#contact" onClick={() => setOpen(false)} className="mt-3 w-full">Share requirements</ShimmerButton>
        </div>
      )}
    </header>
  )
}
