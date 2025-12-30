"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin, Clock, ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { SectionWrapper, MotionH2, MotionP, MotionDiv, childVariants } from "@/components/landing/SectionWrapper"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/lib/api"

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    value: "support@athith.com",
    href: "mailto:support@athith.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+91 12345 67890",
    href: "tel:+911234567890",
  },
]

const businessHours = [
  { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
  { day: "Saturday", time: "10:00 AM - 4:00 PM" },
  { day: "Sunday", time: "Closed" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await apiClient.post("/contact", formData)
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you soon.",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
        action: <XCircle className="h-5 w-5" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full">
        <SectionWrapper className="pt-12 pb-12 bg-muted/40">
          <div className="text-center">
            <MotionH2 variants={childVariants} className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Get In Touch
            </MotionH2>
            <MotionP variants={childVariants} className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Have questions or a project in mind? We're here to help. Reach out and let's start the conversation.
            </MotionP>
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <MotionDiv variants={childVariants} className="max-w-6xl mx-auto">
            <Card className="group grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-lg border">
              <div className="p-8 md:p-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">Let's Connect</h3>
                <p className="text-muted-foreground mb-8">
                  Fill out the form or use our contact details below. We look forward to hearing from you.
                </p>
                <div className="space-y-6 mb-12">
                  {contactDetails.map((item) => (
                    <Link key={item.title} href={item.href} className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">{item.title}</p>
                        <p className="text-primary hover:underline">{item.value}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="font-semibold mb-2 block">Full Name</Label>
                      <Input id="name" name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-semibold mb-2 block">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} required />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="phone" className="font-semibold mb-2 block">Phone Number</Label>
                       <Input id="phone" name="phone" type="tel" placeholder="+91 12345 67890" value={formData.phone} onChange={handleInputChange} required />
                     </div>
                     <div>
                       <Label htmlFor="subject" className="font-semibold mb-2 block">Subject</Label>
                       <Input id="subject" name="subject" placeholder="e.g., Job Inquiry" value={formData.subject} onChange={handleInputChange} required />
                     </div>
                   </div>
                  <div>
                    <Label htmlFor="message" className="font-semibold mb-2 block">Your Message</Label>
                    <Textarea id="message" name="message" placeholder="Tell us more about your needs..." value={formData.message} onChange={handleInputChange} className="h-28" required />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Message <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
              <div className="relative hidden lg:block">
                <Image
                  src="/contact.jpg"
                  alt="Modern office space"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
              </div>
            </Card>
          </MotionDiv>
        </SectionWrapper>

        <SectionWrapper className="bg-muted/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Our Office</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">Visit Us</h3>
              <p className="mt-2 text-lg text-muted-foreground">123 Business Avenue, New Delhi, India</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3 justify-center md:justify-start">
                <Clock className="w-6 h-6" />
                Business Hours
              </h3>
              <div className="space-y-3 text-muted-foreground bg-background p-6 rounded-lg border">
                {businessHours.map((item) => (
                  <div key={item.day} className="flex justify-between">
                    <span>{item.day}</span>
                    <span className="font-semibold">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  )
}