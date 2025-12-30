"use client"

import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { testimonials } from "./data"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "./SectionWrapper"

export function TestimonialsSection() {
  return (
    <SectionWrapper className="bg-muted/40">
      <MotionDiv variants={childVariants}>
        <Carousel opts={{ loop: true }} className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Success Stories</span>
              </div>
              <MotionH2 variants={childVariants} className="text-4xl md:text-5xl font-bold text-foreground text-balance">
                What Our Clients Say
              </MotionH2>
              <MotionP variants={childVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Real stories from professionals who achieved their goals with our guidance.
              </MotionP>
            </div>
            <div className="flex justify-center lg:justify-end gap-2">
              <CarouselPrevious className="relative top-0 left-0 right-0 translate-y-0" />
              <CarouselNext className="relative top-0 left-0 right-0 translate-y-0" />
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, idx) => (
              <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-6">
                    <CardContent className="p-0 flex flex-col h-full">
                      <Quote className="w-10 h-10 text-muted/30 mb-4" />
                      <p className="flex-grow text-base text-muted-foreground leading-relaxed italic mb-6">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-4 border-t pt-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold">{testimonial.initials}</span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </MotionDiv>
    </SectionWrapper>
  )
}