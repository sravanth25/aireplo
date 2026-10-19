// Magic UI-style border beam: a light that travels around the card border
import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'

export function BorderBeam({
  size = 220,
  duration = 9,
  colorFrom = '#22c55e',
  colorTo = '#a3e635',
  className,
}: { size?: number; duration?: number; colorFrom?: string; colorTo?: string; className?: string }) {
  return (
    <div
      style={
        {
          '--size': size,
          '--beam-duration': duration,
          '--color-from': colorFrom,
          '--color-to': colorTo,
        } as CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:1.5px_solid_transparent]',
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect]',
        '[mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        'after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-beam',
        'after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)]',
        'after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]',
        className,
      )}
    />
  )
}
