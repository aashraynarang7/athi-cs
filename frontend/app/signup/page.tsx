"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { registerUser } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AtithiLogo } from "@/components/logo"
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", phoneNumber: "" })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useAppDispatch()
  const { status, user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "succeeded" && user) {
      const dashboardUrl = user.role === 'admin' ? '/admin' : '/customer';
      router.push(dashboardUrl);
    }
  }, [status, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, update } = toast({
      description: "Creating your account...",
      action: <Loader2 className="h-5 w-5 animate-spin" />,
    })

    try {
      await dispatch(registerUser(formData)).unwrap()
      update({
        id,
        title: "Registration Successful!",
        description: "Redirecting you to OTP verification...",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
      router.push(`/verify-email?email=${formData.email}`)
    } catch (error: any) {
      update({
        id,
        title: "Registration Failed",
        description: typeof error === "string" ? error : "An unexpected error occurred.",
        variant: "destructive",
        action: <XCircle className="h-5 w-5" />,
      })
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-start justify-between bg-foreground p-8">
        <AtithiLogo />
        <div className="space-y-4 text-primary-foreground"><h2 className="text-4xl font-bold">Join a Community of Ambitious Professionals</h2><p className="text-primary-foreground/80 max-w-lg">Create your account to get personalized job recommendations and streamlined loan application support.</p><ul className="space-y-2 pt-4"><li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary-foreground/50" /><span>Access exclusive opportunities</span></li><li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary-foreground/50" /><span>Track your applications seamlessly</span></li><li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary-foreground/50" /><span>Get expert guidance and support</span></li></ul></div>
        <div className="text-sm text-primary-foreground/50">© {new Date().getFullYear()} Athith Consultant Services</div>
      </div>
      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto w-[400px] space-y-6">
          <div className="space-y-2 text-center"><h1 className="text-3xl font-bold">Create an Account</h1><p className="text-muted-foreground">Enter your details below to get started.</p></div>
          <Card><CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleInputChange} required /></div>
                <div><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" name="phoneNumber" placeholder="+91 98765 43210" value={formData.phoneNumber} onChange={handleInputChange} required /></div>
                <div className="relative"><Label htmlFor="password">Password</Label><Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-muted-foreground">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
                <Button type="submit" className="w-full" disabled={status === "loading"}>{status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}</Button>
              </form>
            </CardContent></Card>
          <div className="text-center text-sm">Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Log In</Link></div>
        </div>
      </div>
    </div>
  )
}