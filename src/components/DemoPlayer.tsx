import { lazy, Suspense } from 'react'
import { ClientOnly } from '@/components/ClientOnly'
import { DEMO } from '@/remotion/demoSize'

// The video player (Remotion) is a large download, so it loads in its own file after the page shows.
const Inner = lazy(() => import('./DemoPlayerInner'))

export function DemoPlayer({ inputProps }: { inputProps: { brandName: string; color: string } }) {
  const box = <div className="w-full bg-[#070a0e]" style={{ aspectRatio: `${DEMO.width} / ${DEMO.height}` }} />
  return (
    <ClientOnly fallback={box}>
      <Suspense fallback={box}>
        <Inner inputProps={inputProps} />
      </Suspense>
    </ClientOnly>
  )
}
