"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { loginUser } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AtithiLogo } from "@/components/logo"
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
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

    try {
      const result = await dispatch(loginUser(formData)).unwrap()

      toast({
        title: "Login Successful!",
        description: "Redirecting to your dashboard...",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
      
      const dashboardUrl = result.user.role === 'admin' ? '/admin' : '/customer';
      router.push(dashboardUrl)
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error || "Invalid credentials. Please try again.",
        variant: "destructive",
        action: <XCircle className="h-5 w-5" />,
      })
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-start justify-between bg-foreground p-8">
        <AtithiLogo />
        <div className="space-y-4 text-primary-foreground">
          <h2 className="text-4xl font-bold">Welcome Back!</h2>
          <p className="text-primary-foreground/80 max-w-lg">
            Log in to access your personalized dashboard, track applications,
            and continue your journey with us.
          </p>
          <ul className="space-y-2 pt-4">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground/50" />
              <span>Access your personal dashboard</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground/50" />
              <span>Track your application status</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground/50" />
              <span>Continue where you left off</span>
            </li>
          </ul>
        </div>
        <div className="text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Athith Consultant Services
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto w-[400px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Log In to Your Account</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}