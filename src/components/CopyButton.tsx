import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // fallback for browsers that block the clipboard API
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    return ok
  }
}

export function CopyButton({ text, label = 'Copy', className }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  return (
    <button
      type="button"
      onClick={async () => {
        setState((await copyText(text)) ? 'ok' : 'fail')
        setTimeout(() => setState('idle'), 1800)
      }}
      className={cn('inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5', className)}
    >
      {state === 'ok' ? <Check className="size-4 text-brand" /> : <Copy className="size-4" />}
      {state === 'ok' ? 'Copied' : state === 'fail' ? 'Select and copy manually' : label}
    </button>
  )
}
