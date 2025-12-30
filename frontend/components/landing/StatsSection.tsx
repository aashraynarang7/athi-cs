"use client"

import { useEffect, useRef } from "react"
import { useInView, useSpring, motion } from "framer-motion"
import { stats } from "./data"
import { MotionDiv, SectionWrapper, MotionH2, MotionP, childVariants } from "./SectionWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const springValue = useSpring(0, {
    damping: 100,
    stiffness: 100,
  })

  useEffect(() => {
    if (isInView) {
      springValue.set(value)
    }
  }, [springValue, isInView, value])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = parseInt(latest.toFixed(0)).toLocaleString()
      }
    })
    return () => unsubscribe()
  }, [springValue])

  return (
    <>
      <span ref={ref}>0</span>
      {suffix && <span className="text-3xl md:text-4xl">{suffix}</span>}
      <span>+</span>
    </>
  )
}

const StatCard = ({ item }: { item: (typeof stats)[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty("--mouse-x", `${x}px`)
    cardRef.current.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-xl border border-border/20 bg-card/60 p-px backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/20"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(var(--color-primary), 0.15), transparent 80%)`,
        }}
      />
      <Card className="bg-transparent border-none h-full text-center transition-transform duration-300 group-hover:-translate-y-1">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-5 border border-primary/20">
            <item.icon className="w-8 h-8 text-primary" />
          </div>
          <div className="text-5xl font-extrabold text-foreground tracking-tighter mb-2">
            <AnimatedNumber value={item.value} suffix={item.suffix} />
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function StatsSection() {
  return (
    <SectionWrapper className="relative bg-muted/40 overflow-hidden">
       <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="text-center space-y-4 mb-12">
        <MotionH2 variants={childVariants} className="text-4xl md:text-5xl font-bold text-foreground text-balance">
          Our Track Record in Numbers
        </MotionH2>
        <MotionP variants={childVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          We are proud of the success we've helped our clients achieve. Our results speak for themselves.
        </MotionP>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, idx) => (
          <MotionDiv key={idx} variants={childVariants} className="group">
            <StatCard item={item} />
          </MotionDiv>
        ))}
      </div>
    </SectionWrapper>
  )
}