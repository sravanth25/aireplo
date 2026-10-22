import { useEffect, useState } from 'react'

// Pages live at real URLs (/partners, /tools/…, /inbox) so search engines and AI crawlers can index them.
// Sections of the home page are anchors (/#pricing).
export type Page = 'home' | 'partners' | 'tools' | 'inbox'

// During build-time pre-rendering there is no window; the prerender script sets the path.
let serverPath = '/'
export function setServerPath(path: string) {
  serverPath = path
}
export const currentPath = () => (typeof window === 'undefined' ? serverPath : window.location.pathname)

export function pageFor(path: string): Page {
  const first = path.replace(/\/+$/, '').split('/')[1] ?? ''
  return first === 'partners' || first === 'tools' || first === 'inbox' ? first : 'home'
}

export function usePage(): Page {
  const [page] = useState<Page>(() => pageFor(currentPath()))
  useEffect(() => {
    // old links like /#partners → /partners (on load and when only the # part changes)
    const legacy = () => {
      const id = window.location.hash.slice(1)
      if (pageFor(window.location.pathname) === 'home' && (id === 'partners' || id === 'tools' || id === 'inbox')) {
        window.location.replace('/' + id)
        return true
      }
      return false
    }
    if (legacy()) return
    // jump to a section once the page has rendered
    const id = window.location.hash.slice(1)
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60)
    window.addEventListener('hashchange', legacy)
    return () => window.removeEventListener('hashchange', legacy)
  }, [])
  return page
}
