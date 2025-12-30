"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"
import Link from "next/link"

const privacyContent = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <p>
        Welcome to Athith Consultant Services. We are committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read
        this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
      </p>
    ),
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    content: (
      <>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Site
          includes:
        </p>
        <h3 className="!text-xl !font-semibold !mt-6">2.1. Personal Data You Provide</h3>
        <p>
          Personally identifiable information, such as your name, shipping address, email address, and telephone
          number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily
          give to us when you register with the Site or when you choose to participate in various activities related to
          the Site.
        </p>
        <h3 className="!text-xl !font-semibold !mt-6">2.2. Automatically Collected Data</h3>
        <p>
          Information our servers automatically collect when you access the Site, such as your IP address, your browser
          type, your operating system, your access times, and the pages you have viewed directly before and after
          accessing the Site.
        </p>
      </>
    ),
  },
  {
    id: "use-of-information",
    title: "3. How We Use Your Information",
    content: (
      <p>
        Having accurate information about you permits us to provide you with a smooth, efficient, and customized
        experience. Specifically, we may use information collected about you via the Site to:
      </p>
    ),
  },
  {
    id: "data-security",
    title: "4. Security of Your Information",
    content: (
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information.
        While we have taken reasonable steps to secure the personal information you provide to us, please be aware that
        despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can
        be guaranteed against any interception or other type of misuse.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "5. Contact Us",
    content: (
      <p>
        If you have questions or comments about this Privacy Policy, please contact us at:{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Contact Page
        </Link>
        .
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState(privacyContent[0].id)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      let currentActiveId = activeId

      for (const section of privacyContent) {
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
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="font-semibold text-lg mb-4">On this page</h3>
                <nav>
                  <ul className="space-y-2">
                    {privacyContent.map((section) => (
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
              <div className="prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-3xl prose-h3:font-semibold prose-h3:text-xl prose-a:text-primary hover:prose-a:underline">
                {privacyContent.map((section) => (
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