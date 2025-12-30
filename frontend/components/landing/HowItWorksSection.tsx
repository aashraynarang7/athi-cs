"use client"

import React from "react"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "./SectionWrapper"
import { Clock, Send, ClipboardList, BrainCircuit, Rocket } from "lucide-react"

// मैंने डेटा को इसी फाइल में डाल दिया है ताकि कोड पूरा हो सके।
// यहाँ एक नया "Training & Development" चरण जोड़ा गया है।
const processSteps = [
  {
    step: 1,
    icon: Send,
    title: "Submit Requirements",
    description: "Tell us about your project, goals, and requirements.",
  },
  {
    step: 2,
    icon: ClipboardList,
    title: "Planning & Strategy",
    description: "We'll create a detailed plan and strategy tailored for you.",
  },
  {
    step: 3,
    icon: BrainCircuit,
    title: "Training & Development",
    description: "Our experts will train the models and build your solution.",
  },
  {
    step: 4,
    icon: Rocket,
    title: "Launch & Support",
    description: "We deploy your project and provide continuous support.",
  },
]

export function HowItWorksSection() {
  return (
    <SectionWrapper className="bg-background">
      <div className="text-center space-y-4 mb-20">
        <MotionDiv variants={childVariants} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Simple Process</span>
        </MotionDiv>
        <MotionH2 variants={childVariants} className="text-4xl md:text-5xl font-bold text-foreground text-balance">
          How It Works
        </MotionH2>
        <MotionP variants={childVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A simple, transparent, and efficient process designed for your convenience.
        </MotionP>
      </div>

      {/* 4 चरणों के लिए ग्रिड को md:grid-cols-7 में बदला गया है (4 आइटम + 3 कनेक्टर) */}
      <div className="grid grid-cols-1 md:grid-cols-7 items-start">
        {processSteps.map((item, idx) => (
          <React.Fragment key={item.step}>
            <MotionDiv
              variants={childVariants}
              className="flex flex-col items-center text-center space-y-4 md:col-span-1"
            >
              <div className="relative z-10 w-20 h-20 bg-muted rounded-full flex items-center justify-center border-2 border-border shadow-sm">
                <item.icon className="w-9 h-9 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </MotionDiv>

            {idx < processSteps.length - 1 && (
              <MotionDiv
                variants={childVariants}
                className="hidden md:flex items-center justify-center col-span-1 h-20"
              >
                <div className="w-full border-t-2 border-dashed border-border"></div>
              </MotionDiv>
            )}
          </React.Fragment>
        ))}
      </div>
    </SectionWrapper>
  )
}