import { Player } from '@remotion/player'
import { ProductDemo } from '@/remotion/ProductDemo'
import { DEMO } from '@/remotion/demoSize'

export default function DemoPlayerInner({ inputProps }: { inputProps: { brandName: string; color: string } }) {
  return (
    <Player
      component={ProductDemo}
      inputProps={inputProps}
      durationInFrames={DEMO.durationInFrames}
      compositionWidth={DEMO.width}
      compositionHeight={DEMO.height}
      fps={DEMO.fps}
      autoPlay
      loop
      acknowledgeRemotionLicense
      style={{ width: '100%', aspectRatio: `${DEMO.width} / ${DEMO.height}` }}
    />
  )
}
