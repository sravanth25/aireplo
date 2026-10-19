import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { AireploIcon } from '../components/AireploIcon'

export type DemoProps = {
  brandName: string
  color: string
}

export const DEMO = { width: 1280, height: 800, fps: 30, durationInFrames: 390 }
const SCENE = 130

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

function fadeInOut(frame: number, len: number) {
  return interpolate(frame, [0, 12, len - 12, len], [0, 1, 1, 0], clamp)
}

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

const NAV = ['Inbox', 'Campaigns', 'Chatbots', 'AI Agent', 'Contacts', 'Analytics']

function Sidebar({ brandName, color, active }: DemoProps & { active: number }) {
  return (
    <div style={{ width: 250, background: '#0b0f14', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30, paddingLeft: 6 }}>
        {brandName.trim().toLowerCase() === 'aireplo' ? (
          <AireploIcon spark={false} style={{ width: 44, height: 42, flexShrink: 0 }} />
        ) : (
          <div style={{ width: 42, height: 42, borderRadius: 12, background: color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 22, color: '#05070a' }}>
            {(brandName.trim()[0] || 'B').toUpperCase()}
          </div>
        )}
        <div style={{ fontWeight: 700, fontSize: 22, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
          {brandName || 'Your Brand'}
        </div>
      </div>
      {NAV.map((n, i) => (
        <div
          key={n}
          style={{
            padding: '13px 14px',
            borderRadius: 10,
            fontSize: 17,
            fontWeight: 600,
            color: i === active ? 'white' : 'rgba(255,255,255,0.5)',
            background: i === active ? hexToRgba(color, 0.16) : 'transparent',
            borderLeft: `3px solid ${i === active ? color : 'transparent'}`,
          }}
        >
          {n}
        </div>
      ))}
      <div style={{ marginTop: 'auto', fontSize: 13, color: 'rgba(255,255,255,0.35)', paddingLeft: 6 }}>
        app.{(brandName || 'yourbrand').toLowerCase().replace(/[^a-z0-9]/g, '') || 'yourbrand'}.com
      </div>
    </div>
  )
}

function Stat({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const frame = useCurrentFrame()
  const v = interpolate(frame, [delay, delay + 50], [0, value], { ...clamp, easing: Easing.out(Easing.cubic) })
  return (
    <div style={{ flex: 1, background: '#10161d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: 'white', marginTop: 6 }}>{Math.round(v).toLocaleString('en-IN')}</div>
      <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginTop: 12 }}>
        <div style={{ height: 4, borderRadius: 4, width: `${(v / 12480) * 100}%`, background: color }} />
      </div>
    </div>
  )
}

function BroadcastScene({ color }: DemoProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const pop = spring({ frame: frame - 8, fps, config: { damping: 14 } })
  const progress = interpolate(frame, [20, 90], [0, 100], clamp)
  return (
    <AbsoluteFill style={{ padding: 40, opacity: fadeInOut(frame, SCENE) }}>
      <div style={{ fontSize: 15, color, fontWeight: 700, letterSpacing: 2 }}>CAMPAIGN</div>
      <div style={{ fontSize: 40, fontWeight: 800, color: 'white', marginTop: 6 }}>Festive Sale — 40% off</div>
      <div style={{ display: 'flex', gap: 26, marginTop: 28 }}>
        <div style={{ flex: 1.2, background: '#10161d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 24, transform: `scale(${0.94 + pop * 0.06})`, opacity: pop }}>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>Template preview</div>
          <div style={{ marginTop: 14, background: '#1f2c34', borderRadius: 14, padding: 18, color: 'white', fontSize: 19, lineHeight: 1.45 }}>
            Hi Priya 👋 Our Festive Sale is live! Get <b>40% off</b> on everything till Sunday.
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#53bdeb', fontWeight: 600 }}>Shop now</div>
              <div style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#53bdeb', fontWeight: 600 }}>View catalog</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#10161d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: 18, fontWeight: 600 }}>
              <span>Sending to 12,480 contacts</span>
              <span style={{ color }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 10, background: 'rgba(255,255,255,0.06)', marginTop: 14 }}>
              <div style={{ height: 10, borderRadius: 10, width: `${progress}%`, background: color, boxShadow: `0 0 20px ${hexToRgba(color, 0.6)}` }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <Stat label="Delivered" value={12302} color={color} delay={30} />
            <Stat label="Read" value={10915} color={color} delay={45} />
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <Stat label="Clicked" value={4120} color={color} delay={60} />
            <Stat label="Orders" value={862} color={color} delay={75} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

function Bubble({ text, me, at, color }: { text: string; me?: boolean; at: number; color: string }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - at, fps, config: { damping: 15 } })
  return (
    <div
      style={{
        alignSelf: me ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        background: me ? '#005c4b' : '#1f2c34',
        color: 'white',
        fontSize: 17,
        lineHeight: 1.4,
        padding: '10px 14px',
        borderRadius: 14,
        borderTopRightRadius: me ? 4 : 14,
        borderTopLeftRadius: me ? 14 : 4,
        opacity: s,
        transform: `translateY(${(1 - s) * 16}px)`,
        borderLeft: !me && text.startsWith('✨') ? `3px solid ${color}` : undefined,
      }}
    >
      {text}
    </div>
  )
}

function Node({ title, sub, at, color, x, y }: { title: string; sub: string; at: number; color: string; x: number; y: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - at, fps, config: { damping: 13 } })
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 230, background: '#10161d', border: `1px solid ${hexToRgba(color, 0.45)}`, borderRadius: 14, padding: '14px 16px', transform: `scale(${s})`, opacity: s }}>
      <div style={{ fontSize: 13, color, fontWeight: 700, letterSpacing: 1.5 }}>{sub}</div>
      <div style={{ fontSize: 18, color: 'white', fontWeight: 600, marginTop: 4 }}>{title}</div>
    </div>
  )
}

function BotScene({ color }: DemoProps) {
  const frame = useCurrentFrame()
  const line = interpolate(frame, [20, 70], [0, 1], clamp)
  const typing = frame > 62 && frame < 78
  return (
    <AbsoluteFill style={{ padding: 40, opacity: fadeInOut(frame, SCENE) }}>
      <div style={{ fontSize: 15, color, fontWeight: 700, letterSpacing: 2 }}>CHATBOT + AI AGENT</div>
      <div style={{ fontSize: 40, fontWeight: 800, color: 'white', marginTop: 6 }}>Replies in seconds, 24/7</div>
      <div style={{ display: 'flex', gap: 30, marginTop: 28, flex: 1 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <path d="M 115 70 C 115 120, 115 120, 115 150" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray="200" strokeDashoffset={200 - 200 * line} />
            <path d="M 115 220 C 115 260, 300 250, 300 300" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray="300" strokeDashoffset={300 - 300 * line} />
            <path d="M 115 220 C 115 260, 115 260, 115 300" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray="200" strokeDashoffset={200 - 200 * line} />
          </svg>
          <Node title="Customer says “track order”" sub="TRIGGER" at={5} color={color} x={0} y={0} />
          <Node title="Fetch from Shopify" sub="ACTION" at={22} color={color} x={0} y={150} />
          <Node title="Send status + link" sub="REPLY" at={40} color={color} x={0} y={300} />
          <Node title="AI answers anything else" sub="AI AGENT" at={55} color={color} x={190} y={300} />
        </div>
        <div style={{ width: 380, background: '#0b141a', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 34, height: 34, borderRadius: 99, background: color }} />
            <div style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>Store support <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>· online</span></div>
          </div>
          <Bubble text="Hi, where is my order #4821?" me at={8} color={color} />
          <Bubble text="It's out for delivery 🚚 Arriving today by 6 PM. Track: shop.link/4821" at={34} color={color} />
          <Bubble text="Can I exchange the size later?" me at={52} color={color} />
          {typing && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>typing…</div>}
          <Bubble text="✨ Yes! Exchanges are free within 15 days. Want me to book a pickup?" at={78} color={color} />
        </div>
      </div>
    </AbsoluteFill>
  )
}

function AnalyticsScene({ color, brandName }: DemoProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const bars = [32, 48, 41, 66, 58, 79, 92]
  const revenue = interpolate(frame, [10, 80], [0, 482300], { ...clamp, easing: Easing.out(Easing.cubic) })
  const badge = spring({ frame: frame - 70, fps, config: { damping: 12 } })
  return (
    <AbsoluteFill style={{ padding: 40, opacity: fadeInOut(frame, SCENE) }}>
      <div style={{ fontSize: 15, color, fontWeight: 700, letterSpacing: 2 }}>ANALYTICS</div>
      <div style={{ fontSize: 40, fontWeight: 800, color: 'white', marginTop: 6 }}>Revenue from WhatsApp</div>
      <div style={{ fontSize: 72, fontWeight: 800, color, marginTop: 14 }}>₹{Math.round(revenue).toLocaleString('en-IN')}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, height: 300, marginTop: 24, paddingBottom: 30, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {bars.map((b, i) => {
          const h = spring({ frame: frame - 8 - i * 5, fps, config: { damping: 16 } })
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ height: `${b * h}%`, borderRadius: 10, background: i === bars.length - 1 ? color : hexToRgba(color, 0.35) }} />
            </div>
          )
        })}
      </div>
      <div style={{ position: 'absolute', right: 40, top: 40, transform: `scale(${badge})`, background: hexToRgba(color, 0.15), border: `1px solid ${color}`, color: 'white', padding: '12px 20px', borderRadius: 999, fontWeight: 700, fontSize: 18 }}>
        Powered by {brandName || 'Your Brand'}
      </div>
    </AbsoluteFill>
  )
}

export const ProductDemo: React.FC<DemoProps> = ({ brandName, color }) => {
  const frame = useCurrentFrame()
  const active = frame < SCENE ? 1 : frame < SCENE * 2 ? 2 : 5
  return (
    <AbsoluteFill style={{ background: '#070a0e', fontFamily: 'Inter, system-ui, sans-serif', flexDirection: 'row' }}>
      <Sidebar brandName={brandName} color={color} active={active} />
      <div style={{ flex: 1, position: 'relative' }}>
        <Sequence durationInFrames={SCENE}>
          <BroadcastScene brandName={brandName} color={color} />
        </Sequence>
        <Sequence from={SCENE} durationInFrames={SCENE}>
          <BotScene brandName={brandName} color={color} />
        </Sequence>
        <Sequence from={SCENE * 2} durationInFrames={SCENE}>
          <AnalyticsScene brandName={brandName} color={color} />
        </Sequence>
      </div>
    </AbsoluteFill>
  )
}
