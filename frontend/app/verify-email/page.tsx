"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { verifyEmail } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

function VerifyEmailComponent() {
  const [otp, setOtp] = useState("")
  const dispatch = useAppDispatch()
  const { status } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, update } = toast({
      description: "Verifying your OTP...",
      action: <Loader2 className="h-5 w-5 animate-spin" />,
    })
    try {
      await dispatch(verifyEmail({ otp })).unwrap()
      update({
        id,
        title: "Verification Successful!",
        description: "Redirecting you to the login page...",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
      router.push("/login")
    } catch (error: any) {
      update({
        id,
        title: "Verification Failed",
        description: typeof error === "string" ? error : "Invalid or expired OTP.",
        variant: "destructive",
        action: <XCircle className="h-5 w-5" />,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-[400px]">
        <CardHeader className="text-center"><CardTitle className="text-2xl">Verify Your Email</CardTitle><CardDescription>An OTP has been sent to <strong>{email}</strong>. Please enter it below.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full" disabled={status === "loading" || otp.length < 6}>{status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Account"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<div>Loading...</div>}><VerifyEmailComponent /></Suspense>
}