"use client"

import * as React from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { fetchDashboardOverview } from "@/lib/features/admin/adminSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Users, FileText, Clock, CheckCircle } from "lucide-react"

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Review": "bg-blue-100 text-blue-800 border-blue-200",
  "Requires Action": "bg-orange-100 text-orange-800 border-orange-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
}

const kpiIcons: { [key: string]: React.ElementType } = {
  "Total Users": Users,
  "Total Applications": FileText,
  "Pending Applications": Clock,
  "Approved This Month": CheckCircle,
}

const PIE_CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"]

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div><Skeleton className="h-9 w-64" /><Skeleton className="h-5 w-80 mt-2" /></div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
    </div>
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
      <Card className="lg:col-span-1"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
    </div>
  </div>
)

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch()
  const { dashboardOverview, dashboardStatus: status, error } = useAppSelector((state: RootState) => state.admin)

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardOverview())
    }
  }, [dispatch, status])

  if (status === "loading" && !dashboardOverview) {
    return <DashboardSkeleton />
  }

  if (status === "failed" && !dashboardOverview) {
    return <div className="text-center py-20 text-destructive">{error || "Failed to load dashboard data."}</div>
  }
  
  if (!dashboardOverview) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">An overview of your platform's activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardOverview.statsCards.map((card) => {
          const Icon = kpiIcons[card.title] || FileText
          return (
            <Card key={card.title} className={cn(card.isPrimary && "bg-primary text-primary-foreground")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{card.title}</CardTitle><Icon className={cn("h-4 w-4", card.isPrimary ? "text-primary-foreground" : "text-muted-foreground")} /></CardHeader>
              <CardContent><div className="text-3xl font-bold">{card.value}</div></CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Recent Applications</CardTitle><CardDescription>The latest 5 applications submitted across all categories.</CardDescription></div>
            <Link href="/admin/job-applications"><Button variant="outline" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Applicant</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {dashboardOverview.recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.type}</TableCell>
                    <TableCell><Badge variant="outline" className={cn(statusColors[app.status])}>{app.status}</Badge></TableCell>
                    <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader><CardTitle>Status Breakdown</CardTitle><CardDescription>A summary of all application statuses.</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-72 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={dashboardOverview.statusPieChartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                  {dashboardOverview.statusPieChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}