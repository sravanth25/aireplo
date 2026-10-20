import { useId, type CSSProperties } from 'react'

const SPARK = 'M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z'

/** Aireplo app-tile mark: lowercase "ai" whose i-dot is an AI spark. Same artwork as brand/icon.svg. */
export function AireploMark({ className, style, title }: { className?: string; style?: CSSProperties; title?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={`${id}g`} x1="10" y1="6" x2="90" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4ADE80" />
          <stop offset="0.6" stopColor="#16A34A" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="24" fill={`url(#${id}g)`} />
      <circle cx="40" cy="62" r="16" stroke="#FFFFFF" strokeWidth="11" />
      <rect x="51" y="41" width="11" height="43" rx="5.5" fill="#FFFFFF" />
      <rect x="71" y="41" width="11" height="43" rx="5.5" fill="#FFFFFF" />
      <path transform="translate(67.5 15) scale(0.75)" d={SPARK} fill="#D9F99D" />
    </svg>
  )
}

/** "aireplo" wordmark where the i-dot is a spark. Uses the site's display font (Bricolage Grotesque 800). */
export function AireploWordmark({ className, style, color = 'currentColor', sparkColor = '#A3E635' }: { className?: string; style?: CSSProperties; color?: string; sparkColor?: string }) {
  return (
    <span
      className={className}
      style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif", fontWeight: 800, letterSpacing: '-0.035em', color, whiteSpace: 'nowrap', lineHeight: 1, ...style }}
      aria-label="aireplo"
      role="img"
    >
      <span aria-hidden="true">
        a
        <span style={{ display: 'inline-block', position: 'relative', width: '0.27em', height: '0.74em', verticalAlign: 'baseline' }}>
          <span style={{ position: 'absolute', left: '0.055em', bottom: 0, width: '0.16em', height: '0.53em', borderRadius: '0.03em', background: color }} />
          <svg viewBox="0 0 24 24" style={{ position: 'absolute', left: '-0.01em', top: '-0.07em', width: '0.29em', height: '0.29em' }}>
            <path d={SPARK} fill={sparkColor} />
          </svg>
        </span>
        replo
      </span>
    </span>
  )
}
