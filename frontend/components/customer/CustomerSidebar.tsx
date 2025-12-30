"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AtithiLogo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, User, Bell, LogOut, Settings } from "lucide-react"

const navLinks = [
  { href: "/customer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customer/applications", label: "My Applications", icon: FileText },
  { href: "/customer/profile", label: "My Profile", icon: User },
  // { href: "/customer/notifications", label: "Notifications", icon: Bell },
]

interface CustomerSidebarProps {
  user: {
    fullName: string;
    email: string;
  };
  onLogout: () => void;
}

export function CustomerSidebar({ user, onLogout }: CustomerSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-card border-r fixed">
      <div className="p-4 border-b">
        <AtithiLogo />
      </div>

      <div className="flex-1 p-4 space-y-6">
        <div className="group relative p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-semibold text-sm">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Link href="/customer/profile">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <nav className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto border-t">
        <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-4 w-4 mr-3" />
          Log Out
        </Button>
      </div>
    </aside>
  )
}