import { cn } from '@/lib/utils'
import type { AnchorHTMLAttributes } from 'react'

export function ShimmerButton({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-ink',
        'bg-[linear-gradient(110deg,#22c55e,45%,#bbf7d0,55%,#22c55e)] bg-[length:200%_100%] animate-shimmer',
        'shadow-[0_0_0_1px_rgb(34_197_94/0.4),0_8px_30px_-6px_rgb(34_197_94/0.55)] transition-transform hover:scale-[1.03] active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        className,
      )}
    >
      {children}
    </a>
  )
}

export function GhostButton({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/90',
        'transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        className,
      )}
    >
      {children}
    </a>
  )
}
