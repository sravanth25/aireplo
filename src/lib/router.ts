import { useEffect, useState } from 'react'

// Tiny hash router: #partners and #tools are pages, any other hash is a section on the home page.
export const PAGES = ['partners', 'tools'] as const
export type Page = (typeof PAGES)[number] | 'home'

function current(): Page {
  const h = window.location.hash.slice(1)
  return (PAGES as readonly string[]).includes(h) ? (h as Page) : 'home'
}

export function usePage() {
  const [page, setPage] = useState<Page>(current)
  useEffect(() => {
    const onChange = () => {
      const next = current()
      setPage(next)
      if (next !== 'home') {
        window.scrollTo(0, 0)
        return
      }
      const id = window.location.hash.slice(1)
      // wait for the home page to render, then jump to the section
      setTimeout(() => (id ? document.getElementById(id)?.scrollIntoView() : window.scrollTo(0, 0)), 30)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return page
}
