// Meta lead ad #02 (real estate) "The 1 AM lead": Omni clips + ElevenLabs voiceover + text animation.
//   npx remotion render src/remotion/Root.tsx AdRealEstateLead out.mp4 --public-dir ads/video-02-real-estate/media
// All times are seconds on the voiceover timeline.
import { AbsoluteFill, Audio, staticFile } from 'remotion'
import { AD_FORMAT, BODY, Bubble, BrandBadge, ChatCard, Choices, FeatureChips, Footage, G, Headline, Notice, OfferScene, Pill, Pop, Scene, Stamp, glass, s, type Shot } from './kit'

export const AD_REAL_ESTATE = { ...AD_FORMAT, durationInFrames: s(26) }

const SHOTS: Shot[] = [
  { file: 'shot1.mp4', from: 0, to: 3.7, start: 0 }, // buyer in bed fills the form
  { file: 'shot2.mp4', from: 3.7, to: 7.15, start: 0 }, // empty office at night
  { file: 'shot3.mp4', from: 7.15, to: 12.95, start: 0.5 }, // buyer chatting with the bot
  { file: 'shot4.mp4', from: 12.95, to: 17.45, start: 0.3 }, // morning: manager sees the hot lead
  { file: 'shot5.mp4', from: 17.45, to: 20.8, start: 0.6 }, // site visit
  { file: 'shot6.mp4', from: 20.8, to: 26, start: 0 }, // tower at golden hour
]

function Hook() {
  return (
    <AbsoluteFill style={{ padding: '300px 64px 0' }}>
      <Pop at={0.1}>
        <Pill>🌙 1:07 AM</Pill>
      </Pop>
      <Pop at={0.25} style={{ marginTop: 30 }}>
        <Headline size={104}>
          A buyer just
          <br />
          <G>filled your form…</G>
        </Headline>
      </Pop>
      <Pop at={2.1} from={-60} style={{ marginTop: 48 }}>
        <Notice icon="🏠" top="Meta lead form · now" main="New lead: Rahul · 3BHK enquiry" />
      </Pop>
    </AbsoluteFill>
  )
}

function Asleep() {
  return (
    <AbsoluteFill style={{ padding: '300px 64px 0' }}>
      <Pop at={3.8}>
        <Pill tone="red">⏳ Your team calls back in 9 hours</Pill>
      </Pop>
      <Pop at={3.95} style={{ marginTop: 30 }}>
        <Headline size={100}>Your sales team? Asleep 😴</Headline>
      </Pop>
      <Pop at={5.7} style={{ marginTop: 34 }}>
        <Headline size={92}>
          <G>…but your WhatsApp isn’t.</G> ⚡
        </Headline>
      </Pop>
    </AbsoluteFill>
  )
}

function BotChat() {
  return (
    <AbsoluteFill style={{ padding: '280px 56px 0' }}>
      <Pop at={7.2}>
        <Headline size={76}>
          ⚡ Replied in <G>5 seconds</G>
        </Headline>
      </Pop>
      <Pop at={7.3} style={{ marginTop: 30 }}>
        <ChatCard avatar="S" avatarBg="linear-gradient(135deg,#0ea5e9,#0369a1)" name="Skyline Residency ✅" status="Business account · AI on" minHeight={600}>
          <Bubble at={7.4} out ai size={30}>
            Hi Rahul 👋 Thanks for your interest! Here’s the brochure:
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.1)', borderRadius: 14, padding: '10px 14px', fontWeight: 600 }}>
              📄 Skyline-Brochure.pdf
            </div>
          </Bubble>
          <Bubble at={9.0} out ai size={30}>2BHK or 3BHK?</Bubble>
          <Choices at={9.1} options={['2BHK', '3BHK']} picked={1} pickAt={9.6} />
          <Bubble at={10.0} out ai size={30}>Your budget?</Bubble>
          <Choices at={10.1} options={['₹50–80L', '₹80L–1Cr']} picked={1} pickAt={10.6} />
          <Bubble at={11.0} out ai size={30}>Site visit this weekend?</Bubble>
          <Choices at={11.1} options={['Sat 11 AM', 'Sun 4 PM']} picked={1} pickAt={11.7} />
        </ChatCard>
      </Pop>
      <Stamp at={12.15} top={1300}>
        ✅ Site visit booked · Sun 4 PM
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
      {/* dark panel: the morning office is bright, so the headline needs a backing to stay readable */}
      <Pop at={13.1}>
        <div style={{ ...glass, display: 'inline-block', padding: '26px 34px', background: 'rgba(6,12,10,.82)' }}>
          <Headline size={78}>
            Your team wakes up to
            <br />
            <G>qualified leads.</G>
          </Headline>
        </div>
      </Pop>
      {/* lead card sits low, over the desk, so the manager's face stays visible */}
      <Pop at={13.4} style={{ position: 'absolute', left: 64, right: 64, top: 930 }}>
        <div style={{ ...glass, padding: '24px 30px', fontFamily: BODY, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 40, fontWeight: 800 }}>Rahul Mehta</span>
            <span style={{ background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 26, padding: '8px 16px', borderRadius: 999 }}>🔥 HOT LEAD</span>
          </div>
          <Row k="Looking for" v="3BHK" />
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
          ['📋', 'Every lead tracked', 17.6],
          ['🔁', 'Every follow-up automatic', 19.0],
        ]}
      />
    </AbsoluteFill>
  )
}

export function AdRealEstateLead() {
  return (
    <AbsoluteFill style={{ background: '#05080a' }}>
      <Footage shots={SHOTS} />
      <Scene from={0} to={3.7}>
        <Hook />
      </Scene>
      <Scene from={3.7} to={7.15}>
        <Asleep />
      </Scene>
      <Scene from={7.15} to={12.95}>
        <BotChat />
      </Scene>
      <Scene from={12.95} to={17.45}>
        <Morning />
      </Scene>
      <Scene from={17.45} to={20.8}>
        <Promise_ />
      </Scene>
      <Scene from={20.8}>
        <OfferScene t={20.8} strikeAt={22.4} ctaAt={23.5} extraLine="+ ₹499 per extra feature · Live in 5 days 🚀" />
      </Scene>
      <BrandBadge />
      <Audio src={staticFile('voiceover.mp3')} />
    </AbsoluteFill>
  )
}
