"use client"

import { Shield, Lightbulb, Gem, Handshake } from "lucide-react"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "@/components/landing/SectionWrapper"

const coreValues = [
  {
    icon: Shield,
    title: "Client-First Integrity",
    description: "Your success is our primary measure. We operate with complete transparency and provide honest advice, building lasting relationships based on trust.",
  },
  {
    icon: Lightbulb,
    title: "Empowerment Through Guidance",
    description: "We don't just provide answers; we equip you with the knowledge and confidence to navigate challenges and make informed decisions for your future.",
  },
  {
    icon: Gem,
    title: "Commitment to Excellence",
    description: "From initial consultation to final outcome, we are dedicated to delivering the highest quality service, continuously refining our strategies for you.",
  },
  {
    icon: Handshake,
    title: "Collaborative Partnership",
    description: "We view our clients as partners. We listen to your unique needs, collaborate on strategies, and work alongside you so your goals become our shared objectives.",
  },
]

export function ValuesSection() {
  return (
    <SectionWrapper className="py-12 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
            Our Principles
          </div>
          <MotionH2 variants={childVariants} className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Our Core Values
          </MotionH2>
          <MotionP variants={childVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The guiding principles that define our character and drive every decision we make for your success.
          </MotionP>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {coreValues.map((value, idx) => (
            <MotionDiv
              key={idx}
              variants={childVariants}
              className="group relative p-8 bg-card border border-border/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="relative z-10 flex flex-col items-start">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <value.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}