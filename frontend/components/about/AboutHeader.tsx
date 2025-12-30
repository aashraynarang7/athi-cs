"use client"

import { SectionWrapper, MotionH2, MotionP, childVariants } from "@/components/landing/SectionWrapper"

export function AboutHeader() {
  return (
    <SectionWrapper className="pt-12 pb-12 bg-muted/40">
      <div className="text-center">
        <MotionH2 variants={childVariants} className="text-5xl md:text-6xl font-bold text-foreground mb-4">
          About Athith Consultant Services
        </MotionH2>
        <MotionP variants={childVariants} className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          Empowering individuals to achieve their professional and financial aspirations through expert, personalized guidance.
        </MotionP>
      </div>
    </SectionWrapper>
  )
}