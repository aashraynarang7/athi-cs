import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ReduxProvider } from "@/lib/provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthInitializer } from "@/components/AuthInitializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Athith Consultant Services - Job & Loan Assistance",
  description: "Expert assistance for job search and loan applications",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ReduxProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
          <Toaster />
          <Analytics />
        </ReduxProvider>
      </body>
    </html>
  )
}