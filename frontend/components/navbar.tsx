"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // Image component import kiya gaya hai
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Menu, X, Briefcase, DollarSign, Users, Phone, ArrowRight, LogOut, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/about", label: "About Us", icon: Users },
  { href: "/job-form", label: "Job Assistance", icon: Briefcase },
  { href: "/loan-form", label: "Loan Assistance", icon: DollarSign },
  { href: "/contact", label: "Contact", icon: Phone },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, status } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileOpen])
  
  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push("/")
  }

  const dashboardUrl = user?.role === 'admin' ? '/admin' : '/customer';

  const mobileMenuVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  }

  const mobileNavContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  }

  const mobileNavLinkVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm transition-all duration-300",
          isScrolled ? "border-b shadow-sm" : ""
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" aria-label="Back to homepage">
              <Image
                src="/Logo.jpg" // Apni logo file ka path yahan daalein
                alt="Athith Logo"
                width={120} // Apne logo ke अनुसार width set karein
                height={36} // Apne logo ke अनुसार height set karein
                className="h-10 w-auto"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-2 bg-muted p-1 rounded-full">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {pathname === link.href && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 z-[-1] bg-background rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-border mx-2" />
              {status === "succeeded" && user ? (
                <>
                  <Link href={dashboardUrl}>
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/01.png" alt={user.fullName} />
                          <AvatarFallback>{user.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(dashboardUrl)}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-100">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="group">
                      Sign Up
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed top-0 right-0 z-[100] h-full w-full max-w-sm bg-background shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" aria-label="Back to homepage" onClick={() => setMobileOpen(false)}>
                    <Image
                      src="/logo.png"
                      alt="Athith Logo"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <motion.nav
                  variants={mobileNavContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 p-4 space-y-2"
                >
                  {navLinks.map((link) => (
                    <motion.div key={link.href} variants={mobileNavLinkVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-4 rounded-lg p-3 text-base font-medium transition-colors",
                          pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
                <div className="p-4 mt-auto border-t">
                  {status === "succeeded" && user ? (
                     <div className="space-y-4">
                        <Link href={dashboardUrl} onClick={() => setMobileOpen(false)} className="w-full cursor-pointer">
                           <Button className="w-full">Go to Dashboard</Button>
                        </Link>
                        <Button variant="outline" onClick={handleLogout} className="w-full">
                           Log Out
                        </Button>
                     </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full cursor-pointer">
                        <Button variant="outline" className="w-full">
                          Log In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full">
                        <Button className="w-full cursor-pointer">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}