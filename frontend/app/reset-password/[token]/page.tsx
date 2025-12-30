"use client"

import { useState, Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { resetPassword } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"

function ResetPasswordComponent() {
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useAppDispatch()
  const { status } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.password !== passwords.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive", action: <XCircle className="h-5 w-5" /> })
      return
    }
    const { id, update } = toast({
      description: "Resetting your password...",
      action: <Loader2 className="h-5 w-5 animate-spin" />,
    })
    try {
      await dispatch(resetPassword({ token, password: passwords.password })).unwrap()
      update({
        id,
        title: "Success!",
        description: "Your password has been reset. Redirecting to login...",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
      setTimeout(() => router.push("/login"), 2000)
    } catch (error: any) {
      update({
        id,
        title: "Reset Failed",
        description: typeof error === "string" ? error : "Invalid or expired token.",
        variant: "destructive",
        action: <XCircle className="h-5 w-5" />,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={passwords.password}
                onChange={handleInputChange}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-muted-foreground">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<div>Loading...</div>}><ResetPasswordComponent /></Suspense>
}