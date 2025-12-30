"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { getDashboardOverview } from "@/lib/features/customer/customerSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Briefcase, DollarSign, PlusCircle, FileText, MessageSquare } from "lucide-react"

const activityIcons: { [key: string]: React.ElementType } = {
  update: FileText,
  message: MessageSquare,
  default: FileText,
}

const quickActions = [
  {
    icon: PlusCircle,
    title: "Find a New Job",
    description: "Explore opportunities and submit a new application.",
    href: "/job-form",
  },
  {
    icon: PlusCircle,
    title: "Apply for a Loan",
    description: "Start a new application for financial assistance.",
    href: "/loan-form",
  },
]

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div>
      <Skeleton className="h-9 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card><CardHeader><Skeleton className="h-4 w-1/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-1/2" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-4 w-1/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-1/2" /></CardContent></Card>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Loading recent updates...</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="grow space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
      </div>
    </div>
  </div>
)

export default function CustomerDashboardPage() {
  const dispatch = useAppDispatch()
  const { dashboardData, status, error } = useAppSelector((state: RootState) => state.customer)

  useEffect(() => {
    if (!dashboardData) {
      dispatch(getDashboardOverview())
    }
  }, [dispatch, dashboardData])

  if (status === "loading" && !dashboardData) {
    return <DashboardSkeleton />
  }

  if (status === "failed") {
    return <div className="text-center py-12 text-destructive">{error || "Failed to load dashboard data."}</div>
  }
  
  if (!dashboardData) {
    return <DashboardSkeleton />
  }

  const { user, jobStats, loanStats, recentActivities } = dashboardData

  const statsCards = [
    { title: "Active Job Applications", icon: Briefcase, count: jobStats.count, status: jobStats.latestStatus, href: "/customer/applications" },
    { title: "Active Loan Applications", icon: DollarSign, count: loanStats.count, status: loanStats.latestStatus, href: "/customer/applications" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back, {user?.fullName?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's your dashboard overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsCards.map((card, idx) => (
          <Link href={card.href} key={idx} className="group">
            <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground">{card.status}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A log of your recent application and profile updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.length > 0 ? recentActivities.map((activity: any) => {
                const ActivityIcon = activityIcons[activity.type] || activityIcons.default;
                return (
                  <div key={activity._id} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <ActivityIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="grow">
                      <p className="text-sm text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                )
              }) : (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/customer/notifications" className="w-full">
              <Button variant="ghost" size="sm" className="w-full">
                View All Notifications
              </Button>
            </Link>
          </CardFooter>
        </Card> */}

        {/* <div className="space-y-6">
          {quickActions.map((action, idx) => (
            <Link href={action.href} key={idx}>
              <Card className="group h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-start justify-between h-full">
                  <div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <action.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg">{action.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    Proceed <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div> */}
      </div>
    </div>
  )
}