// Meta lead ad #03 (real estate, Hinglish) "Raat 1 baje lead aaya… subah tak buyer gaya 😬".
// Same Omni footage as ad #02, Hinglish voiceover ("Prayan") and Hinglish text; the hook appears word by word.
//   npx remotion render src/remotion/Root.tsx AdRealEstateHinglish out.mp4 --public-dir ads/video-03-real-estate-hinglish/media
// All times are seconds on the voiceover timeline.
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion'
import { AD_FORMAT, BODY, Bubble, BrandBadge, ChatCard, Choices, DISPLAY, FeatureChips, Footage, G, Headline, OfferScene, Pill, Pop, Scene, Stamp, glass, s, usePop, type Shot } from './kit'

export const AD_RE_HINGLISH = { ...AD_FORMAT, durationInFrames: s(27) }

const SHOTS: Shot[] = [
  { file: 'shot1.mp4', from: 0, to: 4.4, start: 0 }, // buyer in bed fills the form
  { file: 'shot2.mp4', from: 4.4, to: 8.1, start: 0 }, // empty office at night
  { file: 'shot3.mp4', from: 8.1, to: 14.1, start: 0.4 }, // buyer chatting with the bot
  { file: 'shot4.mp4', from: 14.1, to: 18.5, start: 0.3 }, // morning: manager sees the hot lead
  { file: 'shot5.mp4', from: 18.5, to: 21.8, start: 0.6 }, // site visit
  { file: 'shot6.mp4', from: 21.8, to: 27, start: 0 }, // tower at golden hour
]

// ---------- hook: one word at a time, in sync with the voice ----------
type W = { w: string; at: number; tone?: 'green' | 'red' | 'white' }
const HOOK: W[][] = [
  [
    { w: 'Raat', at: 0.09 },
    { w: '1', at: 0.6, tone: 'green' },
    { w: 'baje', at: 0.85, tone: 'green' },
  ],
  [
    { w: 'lead', at: 1.15 },
    { w: 'aaya…', at: 1.45 },
  ],
  [
    { w: 'subah', at: 2.36 },
    { w: 'tak', at: 2.88 },
  ],
  [
    { w: 'buyer', at: 3.2, tone: 'red' },
    { w: 'gaya', at: 3.55, tone: 'red' },
    { w: '😬', at: 3.85, tone: 'white' },
  ],
]

function Word({ w, at, tone = 'white' }: W) {
  const frame = useCurrentFrame()
  const p = usePop(at, 9)
  // a little "punch" the moment the word lands
  const punch = 1 + 0.18 * Math.max(0, 1 - (frame - s(at)) / 6) * (frame >= s(at) ? 1 : 0)
  const color = tone === 'red' ? '#f87171' : '#fff'
  return (
    <span
      style={{
        display: 'inline-block',
        marginRight: 26,
        opacity: Math.min(1, p * 2),
        transform: `translateY(${(1 - p) * 70}px) scale(${(0.6 + 0.4 * p) * punch})`,
        transformOrigin: 'left bottom',
        color,
      }}
    >
      {tone === 'green' ? <G>{w}</G> : w}
    </span>
  )
}

function Hook() {
  return (
    <AbsoluteFill style={{ padding: '290px 64px 0' }}>
      <Pop at={0.05}>
        <Pill>🌙 1:07 AM · New lead</Pill>
      </Pop>
      <div style={{ marginTop: 30, fontFamily: DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 1.04, letterSpacing: '-0.04em', textShadow: '0 8px 40px rgba(0,0,0,.6)' }}>
        {HOOK.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'nowrap' }}>
            {line.map((w) => (
              <Word key={w.w} {...w} />
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

function Asleep() {
  return (
    <AbsoluteFill style={{ padding: '300px 64px 0' }}>
      <Pop at={4.5}>
        <Pill tone="red">⏳ Team ka callback: 9 ghante baad</Pill>
      </Pop>
      <Pop at={4.6} style={{ marginTop: 30 }}>
        <Headline size={100}>Aapki team? So rahi thi 😴</Headline>
      </Pop>
      <Pop at={6.6} style={{ marginTop: 34 }}>
        <Headline size={92}>
          <G>…par aapka WhatsApp nahi!</G> ⚡
        </Headline>
      </Pop>
    </AbsoluteFill>
  )
}

function BotChat() {
  return (
    <AbsoluteFill style={{ padding: '280px 56px 0' }}>
      <Pop at={8.15}>
        <Headline size={76}>
          ⚡ <G>5 second</G> mein reply
        </Headline>
      </Pop>
      <Pop at={8.25} style={{ marginTop: 30 }}>
        <ChatCard avatar="S" avatarBg="linear-gradient(135deg,#0ea5e9,#0369a1)" name="Skyline Residency ✅" status="Business account · AI on" minHeight={600}>
          <Bubble at={8.35} out ai size={30}>
            Namaste Rahul ji 🙏 Interest ke liye thanks! Ye raha brochure:
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.1)', borderRadius: 14, padding: '10px 14px', fontWeight: 600 }}>
              📄 Skyline-Brochure.pdf
            </div>
          </Bubble>
          <Bubble at={10.4} out ai size={30}>2BHK chahiye ya 3BHK?</Bubble>
          <Choices at={10.5} options={['2BHK', '3BHK']} picked={1} pickAt={11.0} />
          <Bubble at={11.3} out ai size={30}>Budget kitna hai?</Bubble>
          <Choices at={11.4} options={['₹50–80L', '₹80L–1Cr']} picked={1} pickAt={11.9} />
          <Bubble at={12.4} out ai size={30}>Is weekend site visit karein?</Bubble>
          <Choices at={12.5} options={['Sat 11 AM', 'Sun 4 PM']} picked={1} pickAt={13.0} />
        </ChatCard>
      </Pop>
      <Stamp at={13.35} top={1300}>
        ✅ Site visit book · Sun 4 PM
      </Stamp>
    </AbsoluteFill>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 32, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
      <span style={{ color: 'rgba(255,255,255,.55)' }}>{k}</span>
      <span style={{ fontWeight: 700, color: '#fff' }}>{v}</span>
    </div>
  )
}

function Morning() {
  return (
    <AbsoluteFill style={{ padding: '290px 64px 0' }}>
      {/* dark panel: the morning office is bright */}
      <Pop at={14.2}>
        <div style={{ ...glass, display: 'inline-block', padding: '26px 34px', background: 'rgba(6,12,10,.82)' }}>
          <Headline size={78}>
            Subah team ke paas
            <br />
            <G>hot leads</G> 🔥
          </Headline>
        </div>
      </Pop>
      <Pop at={17.3} style={{ marginTop: 22 }}>
        <Pill tone="red">❄️ Thande numbers nahi</Pill>
      </Pop>
      {/* lead card low, over the desk, so the manager's face stays visible */}
      <Pop at={14.5} style={{ position: 'absolute', left: 64, right: 64, top: 930 }}>
        <div style={{ ...glass, padding: '24px 30px', fontFamily: BODY, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 40, fontWeight: 800 }}>Rahul Mehta</span>
            <span style={{ background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 26, padding: '8px 16px', borderRadius: 999 }}>🔥 HOT LEAD</span>
          </div>
          <Row k="Chahiye" v="3BHK" />
          <Row k="Budget" v="₹80L – 1Cr" />
          <Row k="Site visit" v="Sun, 4 PM ✅" />
          <Row k="Source" v="Meta ad · 1:07 AM" />
        </div>
      </Pop>
    </AbsoluteFill>
  )
}

function Promise_() {
  return (
    <AbsoluteFill style={{ padding: '290px 64px 0' }}>
      <FeatureChips
        items={[
          ['📋', 'Har lead track', 18.65],
          ['🔁', 'Har follow-up automatic', 20.1],
        ]}
      />
    </AbsoluteFill>
  )
}

export function AdRealEstateHinglish() {
  return (
    <AbsoluteFill style={{ background: '#05080a' }}>
      <Footage shots={SHOTS} />
      <Scene from={0} to={4.4}>
        <Hook />
      </Scene>
      <Scene from={4.4} to={8.1}>
        <Asleep />
      </Scene>
      <Scene from={8.1} to={14.1}>
        <BotChat />
      </Scene>
      <Scene from={14.1} to={18.5}>
        <Morning />
      </Scene>
      <Scene from={18.5} to={21.8}>
        <Promise_ />
      </Scene>
      <Scene from={21.8}>
        <OfferScene
          t={21.8}
          strikeAt={23.3}
          ctaAt={24.35}
          ownLine="one-time · hamesha aapka"
          zeroLine="→ ₹0/mahina"
          extraLine="+ ₹499 har extra feature · 5 din mein live 🚀"
          ctaText="👇 Free demo ke liye tap karein"
        />
      </Scene>
      <BrandBadge />
      <Audio src={staticFile('voiceover.mp3')} />
    </AbsoluteFill>
  )
}
