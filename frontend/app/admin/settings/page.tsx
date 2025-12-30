"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { fetchAdminUsers, fetchWebsiteSettings, updateWebsiteSettings, addAdminUser, AdminUser } from "@/lib/features/admin/adminSlice"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { User, Users, Globe, Eye, EyeOff, MoreHorizontal, PlusCircle, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type SettingsTab = "profile" | "admins" | "website"

const statusColors: Record<"Active" | "Inactive", string> = {
  Active: "bg-green-100 text-green-800 border-green-200",
  Inactive: "bg-gray-100 text-gray-800 border-gray-200",
}

const columns: ColumnDef<AdminUser>[] = [
  { accessorKey: "name", header: "User", cell: ({ row }) => { const u = row.original; return (<div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarImage src={u.avatarUrl} alt={u.name} /><AvatarFallback>{u.name.charAt(0)}</AvatarFallback></Avatar><div><div className="font-medium">{u.name}</div><div className="text-sm text-muted-foreground">{u.email}</div></div></div>) } },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline" className={cn(statusColors[row.getValue("status") as "Active" | "Inactive"])}>{row.getValue("status")}</Badge> },
  { id: "actions", cell: () => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem>Edit Role</DropdownMenuItem><DropdownMenuItem className="text-red-500">Deactivate User</DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
  const [siteSettings, setSiteSettings] = useState({ siteName: "", maintenanceMode: false, applicationFee: 0 })
  const dispatch = useAppDispatch()
  const { adminUsers, websiteSettings, settingsStatus: status, error } = useAppSelector((state: RootState) => state.admin)
  const { toast, dismiss } = useToast()
  
  useEffect(() => {
    dispatch(fetchAdminUsers())
    dispatch(fetchWebsiteSettings())
  }, [dispatch])

  useEffect(() => {
    if (websiteSettings) {
      setSiteSettings(websiteSettings)
    }
  }, [websiteSettings])

  const table = useReactTable({ data: adminUsers, columns, getCoreRowModel: getCoreRowModel() })

  const handleSettingsUpdate = async () => {
    const loadingToast = toast({ description: "Updating settings...", action: <Loader2 className="h-5 w-5 animate-spin" /> })
    try {
      await dispatch(updateWebsiteSettings(siteSettings)).unwrap()
      dismiss(loadingToast.id)
      toast({ title: "Success!", description: "Website settings have been updated.", action: <CheckCircle2 className="h-5 w-5 text-green-500" /> })
    } catch (err) {
      dismiss(loadingToast.id)
      toast({ title: "Update Failed", description: err as string, variant: "destructive", action: <XCircle className="h-5 w-5" /> })
    }
  }

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "admins", label: "Manage Admins", icon: Users },
    { id: "website", label: "Website Settings", icon: Globe },
  ]
  
  const SettingsSkeleton = () => <Card><CardHeader><Skeleton className="h-6 w-1/3 mb-2" /><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-24 self-end" /></CardContent></Card>

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold text-foreground">Settings</h1><p className="text-muted-foreground">Manage your account, team, and website settings.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="md:col-span-1"><div className="flex flex-col space-y-1">{tabs.map((tab) => (<Button key={tab.id} variant="ghost" onClick={() => setActiveTab(tab.id as SettingsTab)} className={cn("justify-start", activeTab === tab.id && "bg-muted font-semibold")}><tab.icon className="mr-2 h-4 w-4" />{tab.label}</Button>))}</div></nav>
        <div className="md:col-span-3">
          {activeTab === "profile" && (<div className="space-y-8"><Card><CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Update your personal details here.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" defaultValue="Admin User" /></div><div><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="admin@example.com" disabled /></div></div><div className="flex justify-end"><Button>Save Changes</Button></div></CardContent></Card></div>)}
          {activeTab === "admins" && (<Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Manage Admin Users</CardTitle><CardDescription>Add, edit, or remove administrators.</CardDescription></div><Button><PlusCircle className="mr-2 h-4 w-4" /> Add Admin</Button></CardHeader><CardContent>{status === 'loading' && adminUsers.length === 0 ? <Skeleton className="h-48 w-full" /> : <div className="rounded-md border"><Table><TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader><TableBody>{table.getRowModel().rows.map((r) => (<TableRow key={r.id}>{r.getVisibleCells().map((c) => (<TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>))}</TableRow>))}</TableBody></Table></div>}</CardContent></Card>)}
          {activeTab === "website" && (status === 'loading' && !websiteSettings ? <SettingsSkeleton /> : <Card><CardHeader><CardTitle>Website Settings</CardTitle><CardDescription>Manage general settings for the public website.</CardDescription></CardHeader><CardContent className="space-y-6"><div><Label htmlFor="siteName">Site Name</Label><Input id="siteName" value={siteSettings.siteName} onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})} /></div><div className="flex items-center justify-between rounded-lg border p-4"><div><h4 className="font-semibold">Maintenance Mode</h4><p className="text-sm text-muted-foreground">Temporarily disable the public website.</p></div><Switch checked={siteSettings.maintenanceMode} onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenanceMode: checked})} /></div><div><Label htmlFor="applicationFee">Application Fee (INR)</Label><Input id="applicationFee" type="number" value={siteSettings.applicationFee} onChange={(e) => setSiteSettings({...siteSettings, applicationFee: Number(e.target.value)})} /></div><div className="flex justify-end"><Button onClick={handleSettingsUpdate} disabled={status === 'loading'}>{status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Website Settings"}</Button></div></CardContent></Card>)}
        </div>
      </div>
    </div>
  )
}