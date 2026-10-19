import { brand } from '@/brand'

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={`${brand.name} home`}>
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-2 text-ink">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 12a8 8 0 1 1 3.5 6.6L4 20l1.4-3.5A8 8 0 0 1 4 12Z" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold text-white">{brand.name}</span>
    </a>
  )
}
