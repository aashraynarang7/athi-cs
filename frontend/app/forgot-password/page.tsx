"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { forgotPassword } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const dispatch = useAppDispatch()
  const { status } = useAppSelector((state) => state.auth)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, update } = toast({
      description: "Sending reset link...",
      action: <Loader2 className="h-5 w-5 animate-spin" />,
    })
    try {
      await dispatch(forgotPassword({ email })).unwrap()
      update({
        id,
        title: "Link Sent!",
        description: "If an account with that email exists, a password reset link has been sent.",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
    } catch (error: any) {
      update({
        id,
        title: "Error",
        description: typeof error === "string" ? error : "Failed to send link.",
        variant: "destructive",
        action: <XCircle className="h-5 w-5" />,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="font-medium text-primary hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}