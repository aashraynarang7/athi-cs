"use client"

import Link from "next/link"
import Image from "next/image"
import { Briefcase, CheckCircle2, ChevronRight, DollarSign, Lightbulb } from "lucide-react"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "./SectionWrapper"

const jobServices = [
  "Profile Optimization & Application Strategy",
  "Expert Interview Preparation",
  "Industrial Dispute Resolution",
  "Guidance on Job-Related Legal Issues",
  "Assistance with ESI Matters",
]

const loanServices = [
  "Personalized Loan Consultation",
  "Complete Documentation Support",
  "Eligibility Verification & Enhancement",
  "Bank Negotiation Assistance",
]

export function ServicesSection() {
  return (
    <SectionWrapper className="bg-background">
      <div className="text-center space-y-4 mb-20">
        <MotionDiv variants={childVariants} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Our Services</span>
        </MotionDiv>
        <MotionH2 variants={childVariants} className="text-4xl md:text-5xl font-bold text-foreground text-balance">
          Comprehensive Solutions for Your Goals
        </MotionH2>
        <MotionP variants={childVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Whether you're seeking your dream job or financial support, we have the expertise and dedication to help you succeed.
        </MotionP>
      </div>

      <div className="space-y-24">
        {/* Job Section - More Prominent (70%) */}
        <MotionDiv variants={childVariants} className="group grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-3 bg-muted px-3 py-1.5 rounded-full">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Job Seeker & Legal Services</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We provide end-to-end career support, from profile optimization to navigating complex workplace challenges. Our expertise also covers crucial guidance on industrial disputes, ESI matters, and other job-related legal issues, ensuring you are empowered and protected.
            </p>
            <ul className="space-y-3 pt-2">
              {jobServices.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/job-form"
              className="group/link inline-flex items-center gap-2 text-primary font-semibold transition-all pt-4 text-lg"
            >
              Get Started <ChevronRight className="w-5 h-5 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
          <div className="lg:col-span-3">
            <div className="relative h-96 bg-muted rounded-2xl overflow-hidden">
              <Image
                src="/Hero-1.jpg"
                alt="Professional job assistance"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </MotionDiv>

        {/* Loan Section - Less Prominent (30%) */}
        <MotionDiv variants={childVariants} className="group grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 lg:order-last space-y-6">
            <div className="inline-flex items-center gap-3 bg-muted px-3 py-1.5 rounded-full">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Loan Application Guidance</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Expert guidance through the loan application process, documentation support, and eligibility verification.
            </p>
            <ul className="space-y-3 pt-2">
              {loanServices.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/loan-form"
              className="group/link inline-flex items-center gap-2 text-primary font-semibold transition-all pt-4 text-lg"
            >
              Apply Now <ChevronRight className="w-5 h-5 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
          <div className="lg:col-span-4 lg:order-first">
            <div className="relative h-96 bg-muted rounded-2xl overflow-hidden">
              <Image
                src="/Hero-2.jpg"
                alt="Signing documents for a loan"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </MotionDiv>
      </div>
    </SectionWrapper>
  )
}