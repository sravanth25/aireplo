import { Navbar } from '@/sections/Navbar'
import { Hero } from '@/sections/Hero'
import { Integrations } from '@/sections/Integrations'
import { HowItWorks } from '@/sections/HowItWorks'
import { Features } from '@/sections/Features'
import { TryIt } from '@/sections/TryIt'
import { WhiteLabel } from '@/sections/WhiteLabel'
import { Estimator } from '@/sections/Estimator'
import { Enterprise } from '@/sections/Enterprise'
import { Pricing } from '@/sections/Pricing'
import { Compare } from '@/sections/Compare'
import { PartnerTeaser } from '@/sections/PartnerTeaser'
import { Faq } from '@/sections/Faq'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'
import { Partners } from '@/pages/Partners'
import { Tools } from '@/pages/Tools'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { usePage } from '@/lib/router'

function Home() {
  return (
    <>
      <Hero />
      <Integrations />
      <HowItWorks />
      <Features />
      <TryIt />
      <WhiteLabel />
      <Pricing />
      <Estimator />
      <Enterprise />
      <Compare />
      <PartnerTeaser />
      <Faq />
      <Contact />
    </>
  )
}

export default function App() {
  const page = usePage()
  return (
    <>
      <Navbar page={page} />
      <main key={page}>{page === 'partners' ? <Partners /> : page === 'tools' ? <Tools /> : <Home />}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
