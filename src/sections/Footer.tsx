import { brand } from '@/brand'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">{brand.slogan}</p>
          <p className="mt-2 max-w-xs text-sm text-white/45">{brand.tagline}.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
          <a href="/#features" className="hover:text-white">Features</a>
          <a href="/#pricing" className="hover:text-white">Pricing</a>
          <a href="/#white-label" className="hover:text-white">White-label</a>
          <a href="/partners" className="hover:text-white">Partner program</a>
          <a href="/tools" className="hover:text-white">Free WhatsApp tools</a>
          <a href="/#contact" className="hover:text-white">Contact</a>
          <a href="/inbox" className="hover:text-white">Team inbox</a>
        </div>
      </div>
      <nav aria-label="Legal" className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 text-xs text-white/45 sm:px-6">
        <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        <a href="/terms" className="hover:text-white">Terms of Service</a>
        <a href="/refund-policy" className="hover:text-white">Refund Policy</a>
      </nav>
      <p className="mx-auto mt-4 max-w-6xl px-4 text-xs text-white/30 sm:px-6">© {new Date().getFullYear()} {brand.name}. WhatsApp is a trademark of Meta Platforms, Inc.</p>
    </footer>
  )
}
