"use client"

import { useState } from "react"
import { Gem, Target, Eye, Scale, Zap } from "lucide-react"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "./SectionWrapper"

const features = [
  {
    icon: Gem,
    title: "Integrated Expertise",
    description: "We are your single point of contact for both career advancement and financial guidance. Our holistic approach ensures that your professional and financial goals are perfectly aligned, saving you time and eliminating complexity.",
  },
  {
    icon: Target,
    title: "Personalized Strategy",
    description: "We don't believe in one-size-fits-all. We take the time to understand your unique situation to create a customized roadmap for your success.",
  },
  {
    icon: Eye,
    title: "Transparent Process",
    description: "Honesty and clarity are at the core of our services. We keep you informed at every step, ensuring a trustworthy and collaborative partnership.",
  },
  {
    icon: Scale,
    title: "Legal & Compliance Support",
    description: "Navigate job-related legalities and ESI matters with confidence. Our expertise provides a crucial layer of protection and peace of mind.",
  },
  {
    icon: Zap,
    title: "Efficient & Results-Driven",
    description: "Our streamlined processes are designed to be effective and efficient, focusing on achieving the best possible outcomes for you without unnecessary delays.",
  },
]

const PrimaryFeatureCard = ({ item }: { item: (typeof features)[0] }) => (
  <MotionDiv
    variants={childVariants}
    className="md:col-span-2 lg:col-span-1 lg:row-span-2 relative group rounded-xl p-8 border border-border bg-card overflow-hidden"
  >
    <div
      aria-hidden="true"
      className="absolute inset-0.5 rounded-xl bg-card z-0"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-30 z-0 animate-[rotate_6s_linear_infinite]"
    />
    <div className="relative z-10 space-y-6">
      <div className="w-16 h-16 bg-primary/15 rounded-lg flex items-center justify-center">
        <item.icon className="w-9 h-9 text-primary" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
        <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
      </div>
    </div>
  </MotionDiv>
)

const SecondaryFeatureCard = ({ item }: { item: (typeof features)[0] }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <MotionDiv
      variants={childVariants}
      onMouseMove={handleMouseMove}
      style={{
        "--mouse-x": `${mousePos.x}px`,
        "--mouse-y": `${mousePos.y}px`,
      } as React.CSSProperties}
      className="group/card relative rounded-xl p-px border border-border bg-card hover:shadow-xl transition-all duration-300"
    >
      <div className="relative rounded-[11px] p-8 h-full bg-card">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-xl opacity-0 transition duration-300 group-hover/card:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 71, 171, 0.1), transparent 80%)`,
          }}
        />
        <div className="relative z-10 space-y-4">
          <div className="w-14 h-14 bg-primary/15 rounded-lg flex items-center justify-center transition-colors group-hover/card:bg-primary/25">
            <item.icon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}

export function WhyChooseUsSection() {
  const primaryFeature = features[0]
  const secondaryFeatures = features.slice(1)

  return (
    <SectionWrapper className="bg-muted/40">
      <div className="text-center space-y-4 mb-16">
        <MotionH2 variants={childVariants} className="text-4xl md:text-5xl font-bold text-foreground text-balance">
          Why Partner with Athith?
        </MotionH2>
        <MotionP variants={childVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your dedicated partner in navigating career and financial challenges with confidence and clarity.
        </MotionP>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PrimaryFeatureCard item={primaryFeature} />
        {secondaryFeatures.map((item, idx) => (
          <SecondaryFeatureCard key={idx} item={item} />
        ))}
      </div>
    </SectionWrapper>
  )
}