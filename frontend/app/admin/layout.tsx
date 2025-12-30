"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { MobileHeader } from "@/components/admin/MobileHeader"
import { AtithiLogo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Briefcase, DollarSign, Users, BarChart3, LogOut, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mainNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

const managementNavLinks = [
  { href: "/admin/job-applications", label: "Job Applications", icon: Briefcase },
  { href: "/admin/loan-applications", label: "Loan Applications", icon: DollarSign },
  { href: "/admin/users", label: "User Management", icon: Users },
]

const FullScreenLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { user, status } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === "failed") {
      router.push("/login")
    } else if (status === "succeeded" && user?.role !== 'admin') {
      router.push("/customer")
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
    await dispatch(logoutUser())
    router.push("/login")
  }

  if (status === "loading" || status === "idle") {
    return <FullScreenLoader />
  }

  if (!user || user.role !== 'admin') {
    return <FullScreenLoader />
  }

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <MobileHeader onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 400, damping: 40 }} className="fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-[#111827] text-primary-foreground shadow-2xl lg:hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <AtithiLogo />
                  <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(false)} className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"><X className="h-6 w-6" /></Button>
                </div>
                <nav className="flex-1 p-4 space-y-6">
                  <div>
                    <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Analytics</p>
                    {mainNavLinks.map((link) => (<Link key={link.href} href={link.href} onClick={() => setMobileSidebarOpen(false)} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors", pathname === link.href ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}><link.icon className="h-5 w-5" />{link.label}</Link>))}
                  </div>
                  <div>
                    <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Management</p>
                    {managementNavLinks.map((link) => (<Link key={link.href} href={link.href} onClick={() => setMobileSidebarOpen(false)} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors", pathname === link.href ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}><link.icon className="h-5 w-5" />{link.label}</Link>))}
                  </div>
                </nav>
                <div className="p-4 mt-auto border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* <Avatar className="h-9 w-9"><AvatarFallback>AD</AvatarFallback></Avatar> */}
                      <div><p className="font-semibold text-sm">{user.fullName}</p><p className="text-xs text-white/60">Administrator</p></div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-white/60 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}