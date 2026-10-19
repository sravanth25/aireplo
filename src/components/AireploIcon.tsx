import { useId, type CSSProperties } from 'react'

// The Aireplo mark: an "A" whose crossbar is a reply arrow, with an AI spark.
// Same artwork as brand/icon.svg. Gradient ids are made unique per instance.
export function AireploIcon({ className, style, spark = true, title }: { className?: string; style?: CSSProperties; spark?: boolean; title?: string }) {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  return (
    <svg viewBox={spark ? '0 0 70 64' : '0 0 66 64'} fill="none" className={className} style={style} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={g('l')} x1="32" y1="6" x2="12" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b9f5a0" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id={g('r')} x1="34" y1="10" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4ade80" />
          <stop offset="0.5" stopColor="#2dd4a7" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id={g('w')} x1="15" y1="40" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a7f3d0" />
        </linearGradient>
        <linearGradient id={g('s')} x1="61" y1="0" x2="61" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d9f99d" />
          <stop offset="1" stopColor="#a3e635" />
        </linearGradient>
      </defs>
      <path d="M33 11 L53 55" stroke={`url(#${g('r')})`} strokeWidth="14" strokeLinecap="round" />
      <path d="M13 55 L33 11" stroke={`url(#${g('l')})`} strokeWidth="14" strokeLinecap="round" />
      <path d="M15.5 43 L24 35.5 V40 H35.5 V30 H41.5 V46 H24 V50.5 Z" fill={`url(#${g('w')})`} stroke={`url(#${g('w')})`} strokeWidth="1.2" strokeLinejoin="round" />
      {spark && (
        <path d="M61 1 C62 6.4 63.1 7.6 68.5 8.5 C63.1 9.4 62 10.6 61 16 C60 10.6 58.9 9.4 53.5 8.5 C58.9 7.6 60 6.4 61 1 Z" fill={`url(#${g('s')})`} />
      )}
    </svg>
  )
}

/** "Ai" in brand gradient + "replo" in the text color. */
export function AireploWordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="bg-gradient-to-b from-[#bef264] to-[#22c55e] bg-clip-text text-transparent">Ai</span>
      <span>replo</span>
    </span>
  )
}
