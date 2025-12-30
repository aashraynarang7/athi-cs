"use client"

import Link from "next/link"
import { HelpCircle, Plus, Minus } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { faqs } from "./data"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "./SectionWrapper"

export function FaqSection() {
  return (
    <SectionWrapper className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1">
          <MotionDiv variants={childVariants} className="sticky top-24">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">FAQ</span>
            </div>
            <MotionH2 variants={childVariants} className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-6">
              Common Questions
            </MotionH2>
            <MotionP variants={childVariants} className="text-lg text-muted-foreground mb-8">
              Find answers to common questions about our services and processes.
            </MotionP>
            <MotionDiv variants={childVariants}>
              <Card className="bg-muted/40 p-6 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Still have questions?</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Can't find the answer you're looking for? Our team is happy to help.
                </p>
                <Link href="/contact">
                  <Button className="w-full cursor-pointer">Contact Us</Button>
                </Link>
              </Card>
            </MotionDiv>
          </MotionDiv>
        </div>

        <div className="lg:col-span-2">
          <MotionDiv variants={childVariants}>
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="bg-card border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="p-6 text-left font-semibold text-lg hover:no-underline group">
                    <span className="flex-1 pr-4 group-hover:text-primary transition-colors">{faq.question}</span>
                    <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                      <Plus className="h-5 w-5 transition-transform duration-300 transform group-data-[state=open]:rotate-45 group-data-[state=open]:opacity-0" />
                      <Minus className="h-5 w-5 absolute transition-transform duration-300 transform scale-75 opacity-0 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 pt-0">
                    <p className="text-muted-foreground text-base leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </MotionDiv>
        </div>
      </div>
    </SectionWrapper>
  )
}

// You might need to add this Card component if it's not globally available
// For simplicity, I'm defining a basic one here.
// If you have `components/ui/card.tsx`, you can remove this.
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
)