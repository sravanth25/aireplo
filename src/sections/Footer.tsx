import { brand } from '@/brand'
import { Logo } from '@/components/Logo'
import { contentLinks } from '@/content/links'

const product: [string, string][] = [
  ['Features', '/#features'],
  ['Pricing', '/#pricing'],
  ['White-label', '/#white-label'],
  ['Enterprise', '/#enterprise'],
  ['Partner program', '/partners'],
  ['Free WhatsApp tools', '/tools'],
  ['Contact', '/#contact'],
  ['Team inbox', '/inbox'],
]

const columns: { title: string; links: [string, string][] }[] = [
  { title: 'Product', links: product },
  ...contentLinks.map((c) => ({ title: c.title, links: [...c.pages, c.all] })),
]

export function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
        <div>
          <Logo />
          <p className="mt-3 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">{brand.slogan}</p>
          <p className="mt-2 max-w-xs text-sm text-white/45">{brand.tagline}.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:contents">
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-xs font-semibold tracking-[0.14em] text-white/80 uppercase">{c.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-white/50">
                {c.links.map(([label, href]) => (
                  <li key={href}><a href={href} className="hover:text-white">{label}</a></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <nav aria-label="Legal" className="mx-auto mt-10 flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 text-xs text-white/45 sm:px-6">
        <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        <a href="/terms" className="hover:text-white">Terms of Service</a>
        <a href="/refund-policy" className="hover:text-white">Refund Policy</a>
      </nav>
      <p className="mx-auto mt-4 max-w-6xl px-4 text-xs text-white/30 sm:px-6">© {new Date().getFullYear()} {brand.name}. WhatsApp is a trademark of Meta Platforms, Inc.</p>
    </footer>
  )
}
