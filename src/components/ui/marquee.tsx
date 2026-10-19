// Magic UI-style marquee (as published on 21st.dev)
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function Marquee({
  children,
  reverse,
  className,
  repeat = 4,
}: { children: ReactNode; reverse?: boolean; className?: string; repeat?: number }) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
        className,
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)] animate-marquee group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
