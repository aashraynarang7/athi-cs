"use client"

import Link from "next/link"
import Image from "next/image"
import { Users, Linkedin, Twitter } from "lucide-react"
import { team } from "./data"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "./SectionWrapper"
import { Card, CardContent } from "@/components/ui/card"

export function TeamSection() {
  return (
    <SectionWrapper className="bg-muted/40">
      <div className="text-center space-y-4 mb-16">
        <MotionDiv variants={childVariants} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Our Team</span>
        </MotionDiv>
        <MotionH2 variants={childVariants} className="text-4xl md:text-5xl font-bold text-foreground text-balance">
          Meet Our Experts
        </MotionH2>
        <MotionP variants={childVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experienced professionals dedicated to your success.
        </MotionP>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member, idx) => (
          <MotionDiv key={idx} variants={childVariants}>
            <Card className="group relative text-center bg-card h-full overflow-hidden rounded-xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="rounded-full object-cover ring-4 ring-primary/10 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-xl text-foreground">{member.name}</h3>
                <p className="text-primary font-semibold text-sm mb-3">{member.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{member.bio}</p>

                <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-4">
                  <Link href={member.socials.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                  <Link href={member.socials.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </div>
    </SectionWrapper>
  )
}