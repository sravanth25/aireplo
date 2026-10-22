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

export function Home() {
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
