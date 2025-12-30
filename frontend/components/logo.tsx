"use client"

import Link from "next/link"

export function AtithiLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <img
        src="/Logo.jpg"
        alt="Atithi Consultant Services"
        className="h-10 object-contain"
      />
    </Link>
  )
}
