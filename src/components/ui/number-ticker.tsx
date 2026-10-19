import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'

export function NumberTicker({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const last = useRef(0)
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const c = animate(last.current, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => (node.textContent = prefix + Math.round(v).toLocaleString('en-IN') + suffix),
    })
    last.current = value
    return () => c.stop()
  }, [inView, value, prefix, suffix])
  return <span ref={ref}>{prefix + value.toLocaleString('en-IN') + suffix}</span>
}
