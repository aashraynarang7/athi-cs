import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { HeroSection } from "@/components/landing/HeroSection"
import { StatsSection } from "@/components/landing/StatsSection"
import { ServicesSection } from "@/components/landing/ServicesSection"
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { FaqSection } from "@/components/landing/FaqSection"
import { TeamSection } from "@/components/landing/TeamSection"
import { CtaSection } from "@/components/landing/CtaSection"
import { DisclaimerSection } from "@/components/landing/DisclaimerSection"


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        {/* <TeamSection /> */}
        <CtaSection />
        <DisclaimerSection />
      </main>
      <Footer />
    </div>
  )
}