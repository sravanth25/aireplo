// Meta lead ad #01 "The 2 AM sale": Omni clips + ElevenLabs voiceover + Aireplo text animation.
// Media (clips, voiceover, fonts) lives in ads/video-01-2am-sale/media and is passed as the public dir:
//   npx remotion render src/remotion/Root.tsx AdTwoAmSale out.mp4 --public-dir ads/video-01-2am-sale/media
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { CSSProperties, ReactNode } from 'react'
import { AireploMark } from '../../components/AireploMark'

export const AD_TWO_AM = { fps: 30, width: 1080, height: 1920, durationInFrames: 750 }

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

// ---- timing, in seconds, taken from the pauses in the voiceover ----
const s = (sec: number) => Math.round(sec * 30)
const SHOTS = [
  { file: 'shot1.mp4', from: 0, to: 3.3, start: 0 }, // phone lights up at night
  { file: 'shot2.mp4', from: 3.3, to: 9.6, start: 0 }, // customer chats and pays
  { file: 'shot3.mp4', from: 9.6, to: 13.1, start: 0.6 }, // owner wakes up to the order
  { file: 'shot4.mp4', from: 13.1, to: 18.95, start: 3.2 }, // boutique (starts after the laptop text pans out)
  { file: 'shot5.mp4', from: 18.95, to: 25, start: 0 }, // parcel handover, smile
]

const GREEN = '#22c55e'
const DISPLAY = "'Bricolage Grotesque', Inter, sans-serif"
const BODY = 'Inter, sans-serif'
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

/** 0→1 spring that starts at `at` seconds */
function usePop(at: number, damping = 14) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return spring({ frame: frame - s(at), fps, config: { damping, mass: 0.6 } })
}

function Pop({ at, children, style, from = 40 }: { at: number; children: ReactNode; style?: CSSProperties; from?: number }) {
  const p = usePop(at)
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * from}px) scale(${0.92 + 0.08 * p})`, ...style }}>{children}</div>
}

// ---------- footage ----------
function Footage() {
  return (
    <>
      {SHOTS.map((sh) => {
        const len = s(sh.to) - s(sh.from)
        return (
          <Sequence key={sh.file} from={s(sh.from)} durationInFrames={len}>
            <AbsoluteFill style={{ overflow: 'hidden' }}>
              <OffthreadVideo
                src={staticFile(sh.file)}
                startFrom={s(sh.start)}
                muted
                // no extra zoom: the clips have their own camera moves, and the watermark must stay under the badge
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AbsoluteFill>
          </Sequence>
        )
      })}
      {/* top and bottom shade so text stays readable */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,8,6,.72) 0%, rgba(4,8,6,.15) 32%, rgba(4,8,6,0) 50%, rgba(4,8,6,.25) 75%, rgba(4,8,6,.7) 100%)' }} />
      {/* a short white flash on each cut */}
      {SHOTS.slice(1).map((sh) => (
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

// ---------- shared pieces ----------
function Headline({ children, size = 96, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#fff', textShadow: '0 6px 30px rgba(0,0,0,.55)', ...style }}>
      {children}
    </div>
  )
}

const G = ({ children }: { children: ReactNode }) => (
  <span style={{ background: 'linear-gradient(90deg,#4ade80,#22c55e 55%,#a3e635)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{children}</span>
)

const glass: CSSProperties = {
  background: 'rgba(10,16,20,.78)',
  border: '2px solid rgba(255,255,255,.12)',
  borderRadius: 34,
  backdropFilter: 'blur(14px)',
  boxShadow: '0 30px 80px rgba(0,0,0,.5)',
}

// ---------- scene 1: hook ----------
function SceneHook() {
  return (
    <AbsoluteFill style={{ padding: '300px 70px 0' }}>
      <Pop at={0.15}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 28px', borderRadius: 999, background: 'rgba(15,23,42,.75)', border: '2px solid rgba(148,163,184,.35)', color: '#e2e8f0', fontFamily: BODY, fontWeight: 700, fontSize: 40 }}>
          🌙 <span style={{ fontVariantNumeric: 'tabular-nums' }}>2:07 AM</span>
        </div>
      </Pop>
      <Pop at={0.3} style={{ marginTop: 34 }}>
        <Headline size={112}>A sale at 2 AM…</Headline>
      </Pop>
      <Pop at={1.6} style={{ marginTop: 14 }}>
        <Headline size={84}>
          <G>while the owner slept</G> 😴
        </Headline>
      </Pop>
      {/* incoming message banner, as the phone lights up */}
      <Pop at={1.2} from={-60} style={{ marginTop: 60 }}>
        <div style={{ ...glass, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 28px' }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, background: GREEN, display: 'grid', placeItems: 'center', fontSize: 40, flexShrink: 0 }}>💬</div>
          <div style={{ fontFamily: BODY, color: '#fff', minWidth: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>New message · now</div>
            <div style={{ fontSize: 36, fontWeight: 600, marginTop: 4 }}>Ananya: Blue kurta size M hai? 👗</div>
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  )
}

// ---------- scene 2: the chat ----------
function Bubble({ at, out, children, ai }: { at: number; out?: boolean; children: ReactNode; ai?: boolean }) {
  const p = usePop(at, 13)
  return (
    <div
      style={{
        alignSelf: out ? 'flex-end' : 'flex-start',
        maxWidth: '84%',
        background: out ? '#005c4b' : '#1f2c34',
        color: '#fff',
        fontFamily: BODY,
        fontWeight: 500,
        fontSize: 34,
        lineHeight: 1.35,
        padding: '16px 22px',
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

function Typing({ from, to }: { from: number; to: number }) {
  const frame = useCurrentFrame()
  if (frame < s(from) || frame >= s(to)) return null
  return (
    <div style={{ alignSelf: 'flex-end', background: '#005c4b', borderRadius: 26, borderTopRightRadius: 8, padding: '20px 26px', display: 'flex', gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: '#fff', opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame / 5) - i)) }} />
      ))}
    </div>
  )
}

function SceneChat() {
  const paid = usePop(8.3, 11)
  return (
    <AbsoluteFill style={{ padding: '290px 60px 0' }}>
      <Pop at={3.45}>
        <Headline size={78}>
          ⚡ AI replied in <G>3 seconds</G>
        </Headline>
      </Pop>
      <Pop at={3.55} style={{ marginTop: 36 }}>
        <div style={{ ...glass, background: 'rgba(11,20,26,.92)', overflow: 'hidden', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 26px', background: '#1f2c34' }}>
            <div style={{ width: 66, height: 66, borderRadius: 33, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, color: '#fff' }}>P</div>
            <div style={{ fontFamily: BODY, color: '#fff' }}>
              <div style={{ fontSize: 32, fontWeight: 700 }}>Priya's Boutique ✅</div>
              <div style={{ fontSize: 24, color: '#8ea2ad' }}>Business account · AI on</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '26px 24px 30px', minHeight: 620 }}>
            <Bubble at={3.7}>Hi! Blue kurta size M available hai? 👗</Bubble>
            <Typing from={4.1} to={4.6} />
            <Bubble at={4.6} out ai>
              Yes! Size M is in stock ✨ Price ₹1,299. Shall I send the payment link?
            </Bubble>
            <Bubble at={5.9}>Haan, bhej do 🙏</Bubble>
            <Typing from={6.2} to={6.75} />
            <Bubble at={6.75} out ai>
              Here you go 👇
              <div style={{ marginTop: 12, background: 'rgba(255,255,255,.1)', borderRadius: 16, padding: '14px 0', textAlign: 'center', color: '#53bdeb', fontWeight: 700 }}>Pay ₹1,299</div>
            </Bubble>
          </div>
        </div>
      </Pop>
      {/* payment received stamp, on "Automatically." */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center', opacity: Math.min(1, paid * 1.4), transform: `scale(${0.6 + 0.4 * paid}) rotate(${(1 - paid) * -8}deg)` }}>
        <div style={{ background: GREEN, color: '#04210f', fontFamily: BODY, fontWeight: 800, fontSize: 44, padding: '20px 40px', borderRadius: 999, boxShadow: '0 20px 60px rgba(34,197,94,.55)' }}>✅ Payment received · ₹1,299</div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- scene 3: wakes up to the order ----------
function SceneWake() {
  return (
    <AbsoluteFill style={{ padding: '300px 60px 0' }}>
      <Pop at={9.75} from={-60}>
        <div style={{ ...glass, display: 'flex', alignItems: 'center', gap: 22, padding: '26px 28px' }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: 'linear-gradient(135deg,#4ade80,#16a34a)', display: 'grid', placeItems: 'center', fontSize: 44, flexShrink: 0 }}>🛍️</div>
          <div style={{ fontFamily: BODY, color: '#fff' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>New order · 2:07 AM</div>
            <div style={{ fontSize: 40, fontWeight: 700, marginTop: 4 }}>₹1,299 paid · replied by AI</div>
          </div>
        </div>
      </Pop>
      <Pop at={10.6} style={{ marginTop: 44 }}>
        <Headline size={92}>
          She never typed
          <br />
          <G>a single reply.</G>
        </Headline>
      </Pop>
    </AbsoluteFill>
  )
}

// ---------- scene 4: features ----------
const FEATURES: [string, string, number][] = [
  ['📥', 'Team inbox', 13.25],
  ['📣', 'Broadcasts', 14.0],
  ['🤖', 'AI agent · Hindi & English', 14.8],
  ['🎨', 'Your own brand & logo', 17.2],
]

function SceneFeatures() {
  return (
    <AbsoluteFill style={{ padding: '290px 60px 0' }}>
      <Pop at={13.15}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 26px', borderRadius: 999, background: 'rgba(34,197,94,.18)', border: '2px solid rgba(34,197,94,.55)', color: '#86efac', fontFamily: BODY, fontWeight: 700, fontSize: 32 }}>
          ✔ Official WhatsApp Business API
        </div>
      </Pop>
      <Pop at={13.2} style={{ marginTop: 28 }}>
        <Headline size={88}>
          Everything on <G>WhatsApp.</G>
        </Headline>
      </Pop>
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
        {FEATURES.map(([icon, label, at]) => (
          <Pop key={label} at={at} from={0} style={{ transformOrigin: 'left center' }}>
            <div style={{ ...glass, borderRadius: 999, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 34px 18px 20px', fontFamily: BODY, fontWeight: 700, fontSize: 42, color: '#fff' }}>
              <span style={{ width: 70, height: 70, borderRadius: 35, background: 'rgba(34,197,94,.2)', display: 'grid', placeItems: 'center', fontSize: 38 }}>{icon}</span>
              {label}
            </div>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// ---------- scene 5: offer + call to action ----------
function SceneOffer() {
  const frame = useCurrentFrame()
  const card = usePop(18.95, 16)
  const cta = usePop(22.5, 10)
  const strike = interpolate(frame, [s(20.7), s(21.2)], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) })
  const bounce = frame > s(23.2) ? Math.sin((frame - s(23.2)) / 4) * 6 : 0
  return (
    <AbsoluteFill style={{ padding: '270px 50px 0' }}>
      {/* the card is fully opaque from its first frame, so it also hides a stray sign in the clip */}
      <div style={{ ...glass, background: 'linear-gradient(180deg, rgba(10,40,24,.96), rgba(8,14,18,.96))', border: '2px solid rgba(34,197,94,.6)', padding: '40px 46px', transform: `scale(${0.94 + 0.06 * card})`, transformOrigin: 'top center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <AireploMark style={{ width: 64, height: 64 }} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 48, color: '#fff', letterSpacing: '-0.03em' }}>aireplo</span>
        </div>
        <Pop at={19.15} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 176, lineHeight: 1, letterSpacing: '-0.045em', color: '#fff' }}>₹15,000</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: '#4ade80', marginTop: 10 }}>one-time · you own it</div>
        </Pop>
        <Pop at={20.4} style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: BODY, fontSize: 40, fontWeight: 700 }}>
            <span style={{ position: 'relative', color: 'rgba(255,255,255,.55)' }}>
              Monthly fee
              <span style={{ position: 'absolute', left: 0, top: '52%', height: 6, width: `${strike}%`, background: '#f87171', borderRadius: 3 }} />
            </span>
            <span style={{ color: '#fff' }}>→ ₹0/month</span>
          </div>
        </Pop>
        <Pop at={21.3} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: BODY, fontSize: 36, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>+ ₹499 per extra feature · Live in 5 days 🚀</div>
        </Pop>
      </div>
      {/* call to action, on "Tap below for a free demo" */}
      <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', opacity: Math.min(1, cta * 1.4), transform: `translateY(${(1 - cta) * 50 + bounce}px) scale(${0.85 + 0.15 * cta})` }}>
        <div style={{ background: GREEN, color: '#04210f', fontFamily: BODY, fontWeight: 800, fontSize: 52, padding: '28px 56px', borderRadius: 999, boxShadow: '0 24px 70px rgba(34,197,94,.6)' }}>👇 Tap “Get quote” · Free demo</div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- brand badge (also covers the generator's watermark at the bottom right) ----------
function BrandBadge() {
  return (
    <div style={{ position: 'absolute', left: 896 - 150, top: 1734 - 50, width: 300, height: 100, borderRadius: 50, background: '#0a0f12', border: '2px solid rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <AireploMark style={{ width: 50, height: 50 }} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 38, color: '#fff', letterSpacing: '-0.03em' }}>aireplo</span>
    </div>
  )
}

export function AdTwoAmSale() {
  return (
    <AbsoluteFill style={{ background: '#05080a' }}>
      <Footage />
      <Sequence from={0} durationInFrames={s(3.3)}>
        <SceneLocal at={0}><SceneHook /></SceneLocal>
      </Sequence>
      <Sequence from={s(3.3)} durationInFrames={s(9.6) - s(3.3)}>
        <SceneLocal at={3.3}><SceneChat /></SceneLocal>
      </Sequence>
      <Sequence from={s(9.6)} durationInFrames={s(13.1) - s(9.6)}>
        <SceneLocal at={9.6}><SceneWake /></SceneLocal>
      </Sequence>
      <Sequence from={s(13.1)} durationInFrames={s(18.95) - s(13.1)}>
        <SceneLocal at={13.1}><SceneFeatures /></SceneLocal>
      </Sequence>
      <Sequence from={s(18.95)}>
        <SceneLocal at={18.95}><SceneOffer /></SceneLocal>
      </Sequence>
      <BrandBadge />
      <Audio src={staticFile('voiceover.mp3')} />
    </AbsoluteFill>
  )
}

/**
 * Scenes are written with absolute times (seconds from the start of the ad), but a <Sequence> resets the frame
 * counter to 0. This wrapper shifts it back so `at` values above match the voiceover timeline exactly.
 */
function SceneLocal({ at, children }: { at: number; children: ReactNode }) {
  return <Offset by={s(at)}>{children}</Offset>
}
function Offset({ by, children }: { by: number; children: ReactNode }) {
  // A negative-from Sequence makes children see (frame + by), i.e. the absolute frame.
  return (
    <Sequence from={-by} layout="none">
      {children}
    </Sequence>
  )
}
