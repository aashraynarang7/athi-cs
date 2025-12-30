"use client"

import { Button } from "@/components/ui/button"
import { AtithiLogo } from "@/components/logo"
import { Menu } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between h-16 px-4 border-b bg-card">
      <AtithiLogo />
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  )
}