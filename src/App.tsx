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
import { Inbox } from '@/pages/Inbox'
import { Content } from '@/pages/Content'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { currentPath, usePage } from '@/lib/router'

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
  // the team inbox is a private full-screen app, without the website around it
  if (page === 'inbox') return <Inbox />
  return (
    <>
      <Navbar page={page} />
      <main key={page}>{page === 'partners' ? <Partners /> : page === 'tools' ? <Tools /> : page === 'content' ? <Content path={currentPath()} /> : <Home />}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
