import { Fragment, type ReactNode } from 'react'

// Renders inline **bold** and [link](href) from content data.
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>)
    if (m[1]) out.push(<strong key={key++} className="font-semibold text-white">{m[1]}</strong>)
    else {
      const external = /^https?:\/\//.test(m[3])
      out.push(
        <a key={key++} href={m[3]} className="text-brand underline underline-offset-4 hover:text-brand-2" {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
          {m[2]}
        </a>,
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>)
  return <>{out}</>
}
