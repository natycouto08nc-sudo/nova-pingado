import { AiSommelier } from "@/components/ai-sommelier"
import { AnnouncementBar } from "@/components/announcement-bar"
import { FaqAccordion } from "@/components/faq-accordion"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Newsletter } from "@/components/newsletter"
import { PricingPlans } from "@/components/pricing-plans"
import { ProducersSection } from "@/components/producers-section"
import { ProductGrid } from "@/components/product-grid"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <PricingPlans />
        <ProducersSection />
        <ProductGrid />
        <AiSommelier />
        <FaqAccordion />
        <Newsletter />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
