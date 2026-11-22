// Shared building blocks for the Aireplo video ads (Omni footage + voiceover + text animation).
// Every ad renders with --public-dir pointing at its own media folder, which holds shot*.mp4,
// voiceover.mp3 and fonts/.
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { CSSProperties, ReactNode } from 'react'
import { AireploMark } from '../../components/AireploMark'

export const AD_FORMAT = { fps: 30, width: 1080, height: 1920 }

// ---- fonts (local files, so rendering never depends on the network) ----
const FONTS: [string, number, string][] = [
  ['Bricolage Grotesque', 800, 'BricolageGrotesque-800.woff2'],
  ['Inter', 500, 'Inter-500.woff2'],
  ['Inter', 600, 'Inter-600.woff2'],
  ['Inter', 700, 'Inter-700.woff2'],
  ['Inter', 800, 'Inter-800.woff2'],
]
if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts')
  Promise.all(
    FONTS.map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile('fonts/' + file)})`, { weight: String(weight) }).load().then((f) => document.fonts.add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle))
}

/** seconds → frames */
export const s = (sec: number) => Math.round(sec * 30)
export const GREEN = '#22c55e'
export const DISPLAY = "'Bricolage Grotesque', Inter, sans-serif"
export const BODY = 'Inter, sans-serif'
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

export type Shot = { file: string; from: number; to: number; start: number }

/** 0→1 spring that starts at `at` seconds (absolute ad time) */
export function usePop(at: number, damping = 14) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return spring({ frame: frame - s(at), fps, config: { damping, mass: 0.6 } })
}

export function Pop({ at, children, style, from = 40 }: { at: number; children: ReactNode; style?: CSSProperties; from?: number }) {
  const p = usePop(at)
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * from}px) scale(${0.92 + 0.08 * p})`, ...style }}>{children}</div>
}

// ---------- footage ----------
export function Footage({ shots }: { shots: Shot[] }) {
  return (
    <>
      {shots.map((sh) => (
        <Sequence key={sh.file} from={s(sh.from)} durationInFrames={s(sh.to) - s(sh.from)}>
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            {/* no extra zoom: the clips have their own camera moves, and the watermark must stay under the badge */}
            <OffthreadVideo src={staticFile(sh.file)} startFrom={s(sh.start)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </AbsoluteFill>
        </Sequence>
      ))}
      {/* top and bottom shade so text stays readable */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,8,6,.72) 0%, rgba(4,8,6,.15) 32%, rgba(4,8,6,0) 50%, rgba(4,8,6,.25) 75%, rgba(4,8,6,.7) 100%)' }} />
      {/* a short white flash on each cut */}
      {shots.slice(1).map((sh) => (
        <Sequence key={'flash' + sh.file} from={s(sh.from)} durationInFrames={6}>
          <Flash />
        </Sequence>
      ))}
    </>
  )
}

function Flash() {
  const frame = useCurrentFrame()
  return <AbsoluteFill style={{ background: '#fff', opacity: interpolate(frame, [0, 6], [0.35, 0], clamp) }} />
}

/** A scene shown between `from` and `to` seconds; its children use absolute ad times. */
export function Scene({ from, to, children }: { from: number; to?: number; children: ReactNode }) {
  return (
    <Sequence from={s(from)} durationInFrames={to === undefined ? undefined : s(to) - s(from)}>
      {/* a Sequence resets the frame counter; shift it back so children see the absolute frame */}
      <Sequence from={-s(from)} layout="none">
        {children}
      </Sequence>
    </Sequence>
  )
}

// ---------- text pieces ----------
export function Headline({ children, size = 96, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#fff', textShadow: '0 6px 30px rgba(0,0,0,.55)', ...style }}>
      {children}
    </div>
  )
}

/** green gradient text */
export const G = ({ children }: { children: ReactNode }) => (
  <span style={{ background: 'linear-gradient(90deg,#4ade80,#22c55e 55%,#a3e635)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{children}</span>
)

export const glass: CSSProperties = {
  background: 'rgba(10,16,20,.78)',
  border: '2px solid rgba(255,255,255,.12)',
  borderRadius: 34,
  backdropFilter: 'blur(14px)',
  boxShadow: '0 30px 80px rgba(0,0,0,.5)',
}

export function Pill({ children, tone = 'night' }: { children: ReactNode; tone?: 'night' | 'green' | 'red' }) {
  const t = {
    night: { background: 'rgba(15,23,42,.75)', border: '2px solid rgba(148,163,184,.35)', color: '#e2e8f0' },
    green: { background: 'rgba(34,197,94,.18)', border: '2px solid rgba(34,197,94,.55)', color: '#86efac' },
    red: { background: 'rgba(127,29,29,.6)', border: '2px solid rgba(248,113,113,.55)', color: '#fecaca' },
  }[tone]
  return <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 28px', borderRadius: 999, fontFamily: BODY, fontWeight: 700, fontSize: 38, ...t }}>{children}</div>
}

/** Phone-style notification card */
export function Notice({ icon, iconBg = GREEN, top, main }: { icon: ReactNode; iconBg?: string; top: ReactNode; main: ReactNode }) {
  return (
    <div style={{ ...glass, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 28px' }}>
      <div style={{ width: 80, height: 80, borderRadius: 22, background: iconBg, display: 'grid', placeItems: 'center', fontSize: 42, flexShrink: 0 }}>{icon}</div>
      <div style={{ fontFamily: BODY, color: '#fff', minWidth: 0 }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>{top}</div>
        <div style={{ fontSize: 38, fontWeight: 700, marginTop: 4 }}>{main}</div>
      </div>
    </div>
  )
}

// ---------- WhatsApp-style chat ----------
export function ChatCard({ avatar, avatarBg, name, status, children, minHeight = 620 }: { avatar: string; avatarBg: string; name: string; status: string; children: ReactNode; minHeight?: number }) {
  return (
    <div style={{ ...glass, background: 'rgba(11,20,26,.92)', overflow: 'hidden', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 26px', background: '#1f2c34' }}>
        <div style={{ width: 66, height: 66, borderRadius: 33, background: avatarBg, display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, color: '#fff' }}>{avatar}</div>
        <div style={{ fontFamily: BODY, color: '#fff' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 24, color: '#8ea2ad' }}>{status}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '24px 24px 28px', minHeight }}>{children}</div>
    </div>
  )
}

export function Bubble({ at, out, children, ai, size = 34 }: { at: number; out?: boolean; children: ReactNode; ai?: boolean; size?: number }) {
  const p = usePop(at, 13)
  return (
    <div
      style={{
        alignSelf: out ? 'flex-end' : 'flex-start',
        maxWidth: '86%',
        background: out ? '#005c4b' : '#1f2c34',
        color: '#fff',
        fontFamily: BODY,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.35,
        padding: '14px 22px',
        borderRadius: 26,
        borderTopRightRadius: out ? 8 : 26,
        borderTopLeftRadius: out ? 26 : 8,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + 0.1 * p})`,
        transformOrigin: out ? 'right top' : 'left top',
      }}
    >
      {ai && <div style={{ display: 'inline-block', fontSize: 20, fontWeight: 800, letterSpacing: '.06em', color: '#4ade80', background: 'rgba(34,197,94,.16)', borderRadius: 8, padding: '3px 10px', marginBottom: 8 }}>AI REPLY</div>}
      <div>{children}</div>
    </div>
  )
}

/** Quick-reply buttons under a bot message; `picked` lights up at `pickAt` */
export function Choices({ at, options, picked, pickAt }: { at: number; options: string[]; picked: number; pickAt: number }) {
  const frame = useCurrentFrame()
  const p = usePop(at, 13)
  const on = frame >= s(pickAt)
  return (
    <div style={{ alignSelf: 'flex-end', display: 'flex', gap: 10, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 16}px)` }}>
      {options.map((o, i) => (
        <span
          key={o}
          style={{
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 28,
            padding: '10px 20px',
            borderRadius: 16,
            border: `2px solid ${on && i === picked ? GREEN : 'rgba(83,189,235,.45)'}`,
            background: on && i === picked ? GREEN : 'rgba(31,44,52,.95)',
            color: on && i === picked ? '#04210f' : '#53bdeb',
            transform: on && i === picked ? `scale(${1 + 0.06 * Math.max(0, 1 - (frame - s(pickAt)) / 8)})` : undefined,
          }}
        >
          {o}
        </span>
      ))}
    </div>
  )
}

export function Typing({ from, to }: { from: number; to: number }) {
  const frame = useCurrentFrame()
  if (frame < s(from) || frame >= s(to)) return null
  return (
    <div style={{ alignSelf: 'flex-end', background: '#005c4b', borderRadius: 26, borderTopRightRadius: 8, padding: '20px 26px', display: 'flex', gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: '#fff', opacity: 0.35 + 0.65 * Math.abs(Math.sin(frame / 5 - i)) }} />
      ))}
    </div>
  )
}

/** Big green stamp that pops in at `at` */
export function Stamp({ at, top, children }: { at: number; top: number; children: ReactNode }) {
  const p = usePop(at, 11)
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -8}deg)` }}>
      <div style={{ background: GREEN, color: '#04210f', fontFamily: BODY, fontWeight: 800, fontSize: 44, padding: '20px 40px', borderRadius: 999, boxShadow: '0 20px 60px rgba(34,197,94,.55)' }}>{children}</div>
    </div>
  )
}

export function FeatureChips({ items }: { items: [string, string, number][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
      {items.map(([icon, label, at]) => (
        <Pop key={label} at={at} from={0} style={{ transformOrigin: 'left center' }}>
          <div style={{ ...glass, borderRadius: 999, display: 'flex', alignItems: 'center', gap: 18, padding: '16px 32px 16px 18px', fontFamily: BODY, fontWeight: 700, fontSize: 40, color: '#fff' }}>
            <span style={{ width: 66, height: 66, borderRadius: 33, background: 'rgba(34,197,94,.2)', display: 'grid', placeItems: 'center', fontSize: 36 }}>{icon}</span>
            {label}
          </div>
        </Pop>
      ))}
    </div>
  )
}

// ---------- offer + call to action ----------
/** Price card and CTA. `t` = when the scene starts; `strikeAt` = "monthly fee" strike; `ctaAt` = CTA button. */
export function OfferScene({ t, strikeAt, ctaAt, extraLine = '+ ₹499 per extra feature · Live in 5 days 🚀' }: { t: number; strikeAt: number; ctaAt: number; extraLine?: string }) {
  const frame = useCurrentFrame()
  const card = usePop(t, 16)
  const cta = usePop(ctaAt, 10)
  const strike = interpolate(frame, [s(strikeAt), s(strikeAt + 0.5)], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) })
  const bounce = frame > s(ctaAt + 0.7) ? Math.sin((frame - s(ctaAt + 0.7)) / 4) * 6 : 0
  return (
    <AbsoluteFill style={{ padding: '270px 50px 0' }}>
      {/* opaque from its first frame, so it can also hide anything unwanted in the top of the clip */}
      <div style={{ ...glass, background: 'linear-gradient(180deg, rgba(10,40,24,.96), rgba(8,14,18,.96))', border: '2px solid rgba(34,197,94,.6)', padding: '40px 46px', transform: `scale(${0.94 + 0.06 * card})`, transformOrigin: 'top center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <AireploMark style={{ width: 64, height: 64 }} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 48, color: '#fff', letterSpacing: '-0.03em' }}>aireplo</span>
        </div>
        <Pop at={t + 0.2} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 176, lineHeight: 1, letterSpacing: '-0.045em', color: '#fff' }}>₹15,000</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: '#4ade80', marginTop: 10 }}>one-time · you own it</div>
        </Pop>
        <Pop at={strikeAt - 0.3} style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: BODY, fontSize: 40, fontWeight: 700 }}>
            <span style={{ position: 'relative', color: 'rgba(255,255,255,.55)' }}>
              Monthly fee
              <span style={{ position: 'absolute', left: 0, top: '52%', height: 6, width: `${strike}%`, background: '#f87171', borderRadius: 3 }} />
            </span>
            <span style={{ color: '#fff' }}>→ ₹0/month</span>
          </div>
        </Pop>
        <Pop at={strikeAt + 0.6} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: BODY, fontSize: 36, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>{extraLine}</div>
        </Pop>
      </div>
      <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', opacity: Math.min(1, cta * 1.4), transform: `translateY(${(1 - cta) * 50 + bounce}px) scale(${0.85 + 0.15 * cta})` }}>
        <div style={{ background: GREEN, color: '#04210f', fontFamily: BODY, fontWeight: 800, fontSize: 52, padding: '28px 56px', borderRadius: 999, boxShadow: '0 24px 70px rgba(34,197,94,.6)' }}>👇 Tap “Get quote” · Free demo</div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- brand badge (also covers the video generator's watermark at the bottom right) ----------
export function BrandBadge() {
  return (
    <div style={{ position: 'absolute', left: 896 - 150, top: 1734 - 50, width: 300, height: 100, borderRadius: 50, background: '#0a0f12', border: '2px solid rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <AireploMark style={{ width: 50, height: 50 }} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 38, color: '#fff', letterSpacing: '-0.03em' }}>aireplo</span>
    </div>
  )
}
