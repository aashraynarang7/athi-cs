"use client"

import Image from "next/image"
import { BrainCircuit, Scale, Briefcase } from "lucide-react"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "@/components/landing/SectionWrapper"

export function MissionSection() {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <MotionDiv variants={childVariants}>
          <MotionH2 variants={childVariants} className="text-4xl font-bold text-foreground mb-6">
            Our Guiding Mission
          </MotionH2>
          <MotionP variants={childVariants} className="text-lg text-muted-foreground leading-relaxed mb-8">
            At Athith, our mission is to empower individuals by bridging the gap between talent and opportunity. We provide a comprehensive support system built on a foundation of expertise, integrity, and personalized guidance.
          </MotionP>
          
          <div className="space-y-6">
            <MotionDiv variants={childVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Empowering Through Training</h3>
                <p className="text-muted-foreground mt-1">
                  We prepare you for success with tailored interview coaching and skill enhancement, ensuring you are confident and ready for any challenge.
                </p>
              </div>
            </MotionDiv>

            <MotionDiv variants={childVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Providing Legal Clarity</h3>
                <p className="text-muted-foreground mt-1">
                  We offer expert legal assistance for job-related issues, including industrial disputes and ESI matters, so you can navigate your career with peace of mind.
                </p>
              </div>
            </MotionDiv>

            <MotionDiv variants={childVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Connecting You to Opportunities</h3>
                <p className="text-muted-foreground mt-1">
                  Our core service is to actively help you secure your ideal job. We handle everything from profile building to application strategy to connect you with the right employers.
                </p>
              </div>
            </MotionDiv>
          </div>
        </MotionDiv>
        
        <MotionDiv variants={childVariants} className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/about1.jpg"
            alt="Professional team meeting"
            fill
            className="object-cover"
          />
        </MotionDiv>
      </div>
    </SectionWrapper>
  )
}