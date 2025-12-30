"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/store"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { useToast } from "@/components/ui/use-toast"
import { AtithiLogo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Briefcase, DollarSign, Users, BarChart3, Settings, LogOut, ChevronUp, MessageSquare } from "lucide-react"

const mainNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

const managementNavLinks = [
  { href: "/admin/job-applications", label: "Job Applications", icon: Briefcase },
  { href: "/admin/loan-applications", label: "Loan Applications", icon: DollarSign },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast({ description: "You have been logged out." })
      router.push("/login")
    } catch (error) {
      toast({ description: "Logout failed. Please try again.", variant: "destructive" })
    }
  }

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-[#111827] text-primary-foreground fixed">
      <div className="p-4 border-b border-white/10">
        <AtithiLogo />
      </div>
      <nav className="flex-1 p-4 space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Analytics</p>
          {mainNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", pathname === link.href ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white")}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Management</p>
          {managementNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", pathname === link.href ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white")}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="p-2 mt-auto border-t border-white/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarFallback>AD</AvatarFallback></Avatar>
                <div><p className="font-semibold text-sm text-left">Admin User</p><p className="text-xs text-white/60">Administrator</p></div>
              </div>
              <ChevronUp className="h-4 w-4 text-white/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mb-2" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            {/* <Link href="/admin/settings"><DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem></Link> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:bg-red-500/10 focus:text-red-500"><LogOut className="mr-2 h-4 w-4" /><span>Log Out</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}