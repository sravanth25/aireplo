// Meta lead ad #01 "The 2 AM sale": Omni clips + ElevenLabs voiceover + Aireplo text animation.
// Media (clips, voiceover, fonts) lives in ads/video-01-2am-sale/media and is passed as the public dir:
//   npx remotion render src/remotion/Root.tsx AdTwoAmSale out.mp4 --public-dir ads/video-01-2am-sale/media
import { AbsoluteFill, Audio, staticFile } from 'remotion'
import { AD_FORMAT, BODY, Bubble, BrandBadge, DISPLAY, FeatureChips, Footage, G, GREEN, Headline, OfferScene, Pop, Scene, Stamp, Typing, glass, type Shot } from './kit'

export const AD_TWO_AM = { ...AD_FORMAT, durationInFrames: 750 }

// ---- timing, in seconds, taken from the pauses in the voiceover ----
const SHOTS: Shot[] = [
  { file: 'shot1.mp4', from: 0, to: 3.3, start: 0 }, // phone lights up at night
  { file: 'shot2.mp4', from: 3.3, to: 9.6, start: 0 }, // customer chats and pays
  { file: 'shot3.mp4', from: 9.6, to: 13.1, start: 0.6 }, // owner wakes up to the order
  { file: 'shot4.mp4', from: 13.1, to: 18.95, start: 3.2 }, // boutique (starts after the laptop text pans out)
  { file: 'shot5.mp4', from: 18.95, to: 25, start: 0 }, // parcel handover, smile
]

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
function SceneChat() {
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
      <Stamp at={8.3} top={1300}>
        ✅ Payment received · ₹1,299
      </Stamp>
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
      <div style={{ marginTop: 40 }}>
        <FeatureChips items={FEATURES} />
      </div>
    </AbsoluteFill>
  )
}

export function AdTwoAmSale() {
  return (
    <AbsoluteFill style={{ background: '#05080a' }}>
      <Footage shots={SHOTS} />
      <Scene from={0} to={3.3}>
        <SceneHook />
      </Scene>
      <Scene from={3.3} to={9.6}>
        <SceneChat />
      </Scene>
      <Scene from={9.6} to={13.1}>
        <SceneWake />
      </Scene>
      <Scene from={13.1} to={18.95}>
        <SceneFeatures />
      </Scene>
      <Scene from={18.95}>
        <OfferScene t={18.95} strikeAt={20.7} ctaAt={22.5} />
      </Scene>
      <BrandBadge />
      <Audio src={staticFile('voiceover.mp3')} />
    </AbsoluteFill>
  )
}
