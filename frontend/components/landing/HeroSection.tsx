"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, DollarSign, TrendingUp, Zap } from "lucide-react"
import { motion, useInView, useSpring } from "framer-motion"
import { childVariants, MotionDiv } from "./SectionWrapper"
import Image from "next/image"

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
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

  return <span ref={ref}>0</span>
}

export function HeroSection() {
  return (
    <section className="relative w-full pt-10 md:pt-10 pb-12 md:pb-12 px-4 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
      >
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="space-y-8"
          >
            <MotionDiv variants={childVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Welcome to Athith Consultant Services</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
                Your Gateway to <span className="text-primary">Career Success</span> &{" "}
                <span className="text-primary">Financial Freedom</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Expert guidance for ambitious professionals. We partner with you to navigate career opportunities and
                financial solutions with confidence and transparency.
              </p>
            </MotionDiv>
            <MotionDiv variants={childVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/job-form">
                <Button size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  Find Your Dream Job <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/loan-form">
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover:shadow-lg transition-shadow cursor-pointer">
                  Apply for Loan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </MotionDiv>
            <MotionDiv variants={childVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">100% Transparent Process</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">Expert Consultants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">Certified & Trusted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">24/7 Support Available</span>
              </div>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Image
                  src="/Hero.jpg"
                  width={450}
                  height={450}
                  alt="Professional working on a laptop"
                  className="rounded-2xl object-contain shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                className="absolute -top-8 -left-8 p-4 rounded-xl border bg-background/70 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Successful Placements</p>
                    <div className="text-lg font-bold text-primary flex items-center">
                      <AnimatedNumber value={5000} />
                      <span>+</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
                className="absolute -bottom-8 -right-8 p-4 rounded-xl border bg-background/70 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loans Facilitated</p>
                    <div className="text-lg font-bold text-primary flex items-center">
                      <span>₹</span>
                      <AnimatedNumber value={50} />
                      <span>+ Cr</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}