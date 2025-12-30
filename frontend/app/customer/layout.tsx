"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { CustomerSidebar } from "@/components/customer/CustomerSidebar"
import { MobileHeader } from "@/components/customer/MobileHeader"
import { AtithiLogo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, User, Bell, LogOut, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const navLinks = [
  { href: "/customer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customer/applications", label: "My Applications", icon: FileText },
  { href: "/customer/profile", label: "My Profile", icon: User },
  // { href: "/customer/notifications", label: "Notifications", icon: Bell },
]

const FullScreenLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { user, status } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "failed") {
      router.push("/login")
    } else if (status === "succeeded" && user?.role !== 'customer') {
      router.push(user?.role === 'admin' ? "/admin" : "/login")
    }
  }, [user, status, router])

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [mobileSidebarOpen])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast({ description: "You have been logged out." })
      router.push("/login")
    } catch (error) {
      toast({ description: "Logout failed. Please try again.", variant: "destructive" })
    }
  }

  if (status === "loading" || status === "idle") {
    return <FullScreenLoader />
  }

  if (!user || user.role !== 'customer') {
    return <FullScreenLoader />
  }

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <CustomerSidebar user={user} onLogout={handleLogout} />

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <MobileHeader onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-card shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <AtithiLogo />
                  <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex-1 p-4 space-y-6">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-sm">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="space-y-1">
                     <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
                          pathname === link.href
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="p-4 mt-auto border-t">
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-3" />
                    Log Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}