"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "./SectionWrapper"

export function CtaSection() {
  return (
    <SectionWrapper className="py-8 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <MotionDiv
          variants={childVariants}
          className="relative overflow-hidden rounded-3xl border bg-card/50 text-center shadow-2xl shadow-primary/5"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />

          <div className="px-6 py-16 md:px-12 md:py-20 flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Start your journey</span>
            </div>

            <MotionH2 
              variants={childVariants} 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-6"
            >
              Ready to <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Transform</span> Your Future?
            </MotionH2>

            <MotionP 
              variants={childVariants} 
              className="max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed"
            >
              Join thousands of professionals who have successfully navigated their career and financial paths with our expert guidance.
            </MotionP>

            <MotionDiv 
              variants={childVariants} 
              className="flex flex-col sm:flex-row w-full sm:w-auto gap-4"
            >
              <Link href="/job-form" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-12 px-8 text-base group shadow-lg shadow-primary/20">
                  Find Dream Job
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/loan-form" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full h-12 px-8 text-base group bg-background/60 backdrop-blur-sm">
                  Get Loan Support
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>
    </SectionWrapper>
  )
}