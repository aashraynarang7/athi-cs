"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { getProfileData, updateProfileData, changePassword } from "@/lib/features/customer/customerSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, FileText, Loader2, Pencil, Trash2, UploadCloud, CheckCircle2, XCircle } from "lucide-react"

export default function MyProfilePage() {
  const dispatch = useAppDispatch()
  const { profile, status } = useAppSelector((state: RootState) => state.customer)
  const { toast, dismiss } = useToast()
  
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [localProfile, setLocalProfile] = useState({ fullName: "", phone: "", address: "" })
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false })
  const [documents, setDocuments] = useState([
    { name: "My_Resume_Latest.pdf", type: "Resume", date: "2024-05-10" },
    { name: "Aadhaar_Card.pdf", type: "ID Proof", date: "2024-05-08" },
  ])

  useEffect(() => {
    dispatch(getProfileData())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        fullName: profile.fullName,
        phone: profile.phoneNumber,
        address: profile.address || "",
      })
    }
  }, [profile])

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalProfile({ ...localProfile, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSaveInfo = async () => {
    const loadingToast = toast({ description: "Updating profile...", action: <Loader2 className="h-5 w-5 animate-spin" /> })
    try {
      await dispatch(updateProfileData(localProfile)).unwrap()
      dismiss(loadingToast.id)
      toast({ title: "Success!", description: "Your profile has been updated.", action: <CheckCircle2 className="h-5 w-5 text-green-500" /> })
      setIsEditingInfo(false)
    } catch (error: any) {
      dismiss(loadingToast.id)
      toast({ title: "Update Failed", description: error, variant: "destructive", action: <XCircle className="h-5 w-5" /> })
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" })
      return
    }
    const loadingToast = toast({ description: "Changing password...", action: <Loader2 className="h-5 w-5 animate-spin" /> })
    try {
      await dispatch(changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })).unwrap()
      dismiss(loadingToast.id)
      toast({ title: "Success!", description: "Your password has been changed.", action: <CheckCircle2 className="h-5 w-5 text-green-500" /> })
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      dismiss(loadingToast.id)
      toast({ title: "Failed", description: error, variant: "destructive", action: <XCircle className="h-5 w-5" /> })
    }
  }
  
  const ProfileSkeleton = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-10 w-full" /></div>
        <div><Skeleton className="h-4 w-32 mb-2" /><Skeleton className="h-10 w-full" /></div>
      </div>
      <div><Skeleton className="h-4 w-28 mb-2" /><Skeleton className="h-10 w-full" /></div>
      <div><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-24 w-full" /></div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold text-foreground">My Profile</h1><p className="text-muted-foreground">Manage your personal information, documents, and account settings.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Personal Information</CardTitle><CardDescription>View and edit your personal details.</CardDescription></div>
              {!isEditingInfo && <Button variant="outline" size="icon" onClick={() => setIsEditingInfo(true)}><Pencil className="w-4 h-4" /></Button>}
            </CardHeader>
            <CardContent>
              {status === "loading" && !profile ? <ProfileSkeleton /> : isEditingInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" name="fullName" value={localProfile.fullName} onChange={handleInfoChange} /></div>
                    <div><Label htmlFor="email">Email Address</Label><Input id="email" value={profile?.email || ""} disabled /></div>
                  </div>
                  <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" value={localProfile.phone} onChange={handleInfoChange} /></div>
                  <div><Label htmlFor="address">Address</Label><Textarea id="address" name="address" value={localProfile.address} onChange={handleInfoChange} /></div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsEditingInfo(false)}>Cancel</Button>
                    <Button onClick={handleSaveInfo} disabled={status === "loading"}>{status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><p className="font-medium text-muted-foreground">Full Name</p><p>{profile?.fullName}</p></div>
                    <div><p className="font-medium text-muted-foreground">Email Address</p><p>{profile?.email}</p></div>
                  </div>
                  <div><p className="font-medium text-muted-foreground">Phone Number</p><p>{profile?.phoneNumber}</p></div>
                  <div><p className="font-medium text-muted-foreground">Address</p><p>{profile?.address || "Not provided"}</p></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader><CardTitle>Manage Documents</CardTitle><CardDescription>Upload and maintain your required documents.</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-primary" /><div><p className="font-medium">{doc.name}</p><p className="text-xs text-muted-foreground">{doc.type} - Uploaded on {doc.date}</p></div></div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-2 border-dashed rounded-lg p-8 text-center"><UploadCloud className="w-10 h-10 mx-auto text-muted-foreground mb-2" /><h4 className="font-semibold">Drag & drop files here</h4><p className="text-sm text-muted-foreground">or</p><Button variant="outline" size="sm" className="mt-2">Browse Files</Button><input type="file" className="hidden" /></div>
            </CardContent>
          </Card> */}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Account Settings</CardTitle><CardDescription>Change your password for security.</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="relative"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} type={showPassword.current ? "text" : "password"} required /><button type="button" onClick={() => setShowPassword(p => ({ ...p, current: !p.current }))} className="absolute right-3 top-7 text-muted-foreground">{showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
                <div className="relative"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} type={showPassword.new ? "text" : "password"} required /><button type="button" onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))} className="absolute right-3 top-7 text-muted-foreground">{showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
                <div className="relative"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} type="password" required /></div>
                <Button type="submit" className="w-full" disabled={status === 'loading'}>{status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : "Change Password"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}