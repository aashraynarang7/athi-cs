"use client"

import Link from "next/link"
import { AtithiLogo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Linkedin, Twitter, Youtube } from "lucide-react"

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Job Assistance", href: "/job-form" },
      { label: "Loan Assistance", href: "/loan-form" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Team", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Home", href: "/" },
    ],
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="md:col-span-2 lg:col-span-1">
            <AtithiLogo />
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
              Your partner in navigating career opportunities and financial solutions with confidence and expertise.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-bold mb-4 text-primary-foreground/90">{section.title}</h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-lg text-primary-foreground mb-2">Stay Updated</h3>
              <p className="text-sm text-primary-foreground/70">
                Updated your latest career tips and financial plans.
              </p>
            </div>
            {/* <form className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus:ring-primary-foreground"
              />
              <Button type="submit" variant="secondary" size="icon" className="shrink-0">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form> */}
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">&copy; {currentYear} Athith Consultant Services. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}