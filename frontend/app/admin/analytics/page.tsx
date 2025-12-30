"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { fetchAnalytics } from "@/lib/features/admin/adminSlice"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Calendar as CalendarIcon, TrendingUp, Clock, FileText, Users } from "lucide-react"

const kpiIcons: { [key: string]: React.ElementType } = {
  "Overall Success Rate": TrendingUp,
  "Avg. Approval Time": Clock,
  "Total Applications (Period)": FileText,
  "Total Registered Users": Users,
}

const AnalyticsSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between">
      <div><Skeleton className="h-9 w-64" /><Skeleton className="h-5 w-80 mt-2" /></div>
      <Skeleton className="h-10 w-[300px]" />
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/4 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
    </div>
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
      <Card className="lg:col-span-3"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
      <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
    </div>
  </div>
)

export default function AdminAnalyticsPage() {
  const dispatch = useAppDispatch()
  const { analyticsData, analyticsStatus: status, error } = useAppSelector((state: RootState) => state.admin)
  const [date, setDate] = React.useState<DateRange | undefined>({ from: addDays(new Date(), -29), to: new Date() })

  React.useEffect(() => {
    if (date?.from && date?.to) {
      dispatch(fetchAnalytics({
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
      }))
    }
  }, [dispatch, date])

  if (status === "loading" && !analyticsData) {
    return <AnalyticsSkeleton />
  }

  if (status === "failed") {
    return <div className="text-center py-20 text-destructive">{error}</div>
  }

  if (!analyticsData) {
    return <AnalyticsSkeleton />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1><p className="text-muted-foreground">Deep dive into your platform's performance.</p></div>
        <Popover>
          <PopoverTrigger asChild><Button id="date" variant={"outline"} className="w-full sm:w-[300px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{date?.from ? (date.to ? (<>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>) : (format(date.from, "LLL dd, y"))) : (<span>Pick a date</span>)}</Button></PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end"><Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.kpiData.map((kpi, idx) => {
          const Icon = kpiIcons[kpi.title] || FileText
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{kpi.title}</CardTitle><Icon className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">{kpi.value}</div></CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Application Volume Over Time</CardTitle><CardDescription>Job vs. Loan applications in the selected period.</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-72 w-full">
              <AreaChart data={analyticsData.areaChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} /><YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs><linearGradient id="colorJob" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} /></linearGradient></defs>
                <Area type="monotone" dataKey="Job" stroke="hsl(var(--primary))" fill="url(#colorJob)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Top 5 Job Positions</CardTitle><CardDescription>Most applied-for roles in the selected period.</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.topJobsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid horizontal={false} /><XAxis type="number" hide /><YAxis dataKey="position" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="applications" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}