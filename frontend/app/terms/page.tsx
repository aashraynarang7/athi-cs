"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"
import Link from "next/link"

const termsContent = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p>
        By accessing and using the Athith Consultant Services website, you accept and agree to be bound by the terms
        and provision of this agreement. In addition, when using these particular services, you shall be subject to
        any posted guidelines or rules applicable to such services. Any participation in this service will constitute
        acceptance of this agreement.
      </p>
    ),
  },
  {
    id: "service-description",
    title: "2. Description of Service",
    content: (
      <p>
        Our service provides job placement assistance and loan application guidance. We act as a facilitator to help
        prepare and guide your applications. We do not act as an employer or a lender, and we do not guarantee
        employment or loan approval. Our role is to provide expert review, guidance, and support to maximize your
        chances of success.
      </p>
    ),
  },
  {
    id: "user-obligations",
    title: "3. User Obligations",
    content: (
      <>
        <p>
          As a user, you agree to provide accurate, current, and complete information as prompted by our application
          forms. You are responsible for maintaining the confidentiality of any account and password and are fully
          responsible for all activities that occur under your account. You agree to immediately notify us of any
          unauthorized use of your account.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "4. Disclaimers and Liability",
    content: (
      <p>
        The service is provided on an "as is" and "as available" basis. Athith Consultant Services expressly disclaims
        all warranties of any kind, whether express or implied. We make no warranty that the service will meet your
        requirements or that the service will be uninterrupted, timely, secure, or error-free. The final decision for
        any job offer or loan approval rests solely with the hiring company or financial institution.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "5. Governing Law",
    content: (
      <p>
        This agreement is governed in accordance with the laws of India. Any disputes or claims arising out of or in
        connection with this agreement shall be subject to the exclusive jurisdiction of the courts of New Delhi,
        India.
      </p>
    ),
  },
]

export default function TermsAndConditionsPage() {
  const [activeId, setActiveId] = useState(termsContent[0].id)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      let currentActiveId = activeId

      for (const section of termsContent) {
        const element = document.getElementById(section.id)
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveId = section.id
        }
      }
      setActiveId(currentActiveId)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeId])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 w-full py-12 px-4 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="font-semibold text-lg mb-4">On this page</h3>
                <nav>
                  <ul className="space-y-2">
                    {termsContent.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })
                            setActiveId(section.id)
                          }}
                          className={cn(
                            "block text-sm transition-colors",
                            activeId === section.id
                              ? "text-primary font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            <div ref={contentRef} className="lg:col-span-3 bg-background p-8 sm:p-12 rounded-2xl border shadow-sm">
              <div className="prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-3xl prose-a:text-primary hover:prose-a:underline">
                {termsContent.map((section) => (
                  <section key={section.id} id={section.id} className="mb-12 scroll-mt-20">
                    <h2>{section.title}</h2>
                    {section.content}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}