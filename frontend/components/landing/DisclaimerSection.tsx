"use client"

import { Shield, CheckCircle2 } from "lucide-react"
import { SectionWrapper, MotionDiv, childVariants } from "./SectionWrapper"

export function DisclaimerSection() {
  return (
    <SectionWrapper className="py-8 bg-muted/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <MotionDiv
          variants={childVariants}
          className="relative bg-card/50 backdrop-blur-sm border border-primary/10 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 lg:p-16 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-b from-background to-muted border border-primary/20 rounded-full flex items-center justify-center shadow-xl">
                  <div className="w-36 h-36 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
                    <Shield className="w-16 h-16 text-primary fill-primary/10" />
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border shadow-lg px-4 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Verified</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 text-center lg:text-left space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Our Pledge of <span className="text-primary">Guidance</span> & <span className="text-primary">Transparency</span>
              </h3>
              
              <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                <p>
                  Our primary mission is to be your dedicated partner throughout your career and financial journey. We equip you with professional tools, expert guidance, and strategic support to navigate the complexities of the job search and loan application processes.
                </p>
                <p className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-foreground/80 text-sm md:text-base">
                  It's important to understand that the final decision for employment or loan approval rests solely with the hiring companies and financial institutions. While we are committed to maximizing your potential, we cannot guarantee specific outcomes. This transparency is a cornerstone of our professional integrity.
                </p>
                <p>
                  Our promise is to empower you with the confidence, clarity, and a compelling presentation needed to put your best foot forward at every stage.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold text-sm">Certified Consultant</span>
                </div>
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-background border border-input shadow-sm text-foreground transition-colors hover:bg-muted/50">
                  <span className="font-medium text-sm">100% Ethical Practice</span>
                </div>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </SectionWrapper>
  )
}