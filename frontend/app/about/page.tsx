import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AboutHeader } from "@/components/about/AboutHeader"
import { MissionSection } from "@/components/about/MissionSection"
import { TeamSectionAbout } from "@/components/about/TeamSection"
import { ValuesSection } from "@/components/about/ValuesSection"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full">
        <AboutHeader />
        <MissionSection />
        {/* <TeamSectionAbout /> */}
        <ValuesSection />
      </main>
      <Footer />
    </div>
  )
}