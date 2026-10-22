import { useEffect, useState, type ReactNode } from 'react'

/** Renders `fallback` during build-time pre-rendering and the first paint, then the children in the browser. */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return <>{ready ? children : fallback}</>
}
