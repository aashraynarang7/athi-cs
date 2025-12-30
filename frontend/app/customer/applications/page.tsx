"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { getMyApplications, clearDetailedApplication, Application } from "@/lib/features/customer/customerSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApplicationDetailsView } from "@/components/customer/ApplicationDetailsView"
import { ArrowRight, Briefcase, DollarSign, PlusCircle } from "lucide-react"

const TableSkeleton = () => (
    <Table>
        <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>Details</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>{Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-4 w-24" /></TableCell><TableCell><Skeleton className="h-4 w-16" /></TableCell><TableCell><Skeleton className="h-4 w-48" /></TableCell><TableCell><Skeleton className="h-4 w-24" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell></TableRow>))}</TableBody>
    </Table>
)

export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState("All")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const dispatch = useAppDispatch()
  const { applications, status, error } = useAppSelector((state: RootState) => state.customer)

  useEffect(() => {
    dispatch(getMyApplications())
  }, [dispatch])

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
        setSelectedApp(null);
        dispatch(clearDetailedApplication());
    }
  }

  const filteredApplications = applications.filter((app: Application) => {
    if (activeTab === "All") return true
    return app.type === activeTab
  })

  const renderContent = () => {
    if (status === "loading") { return <TableSkeleton /> }
    if (status === "failed") { return <div className="text-center py-12 text-red-500">{error || "Failed to load applications."}</div> }
    if (filteredApplications.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
          <p className="text-muted-foreground mb-4">You haven't submitted any {activeTab !== 'All' && activeTab.toLowerCase()} applications yet.</p>
          <Link href="/job-form"><Button><PlusCircle className="w-4 h-4 mr-2" />Submit Your First Application</Button></Link>
        </div>
      )
    }

    return (
      <>
        <div className="hidden md:block">
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>Details</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredApplications.map((app: Application) => (
                <TableRow key={app._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{app._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell><div className="flex items-center gap-2">{app.type === "Job" ? <Briefcase className="h-4 w-4 text-muted-foreground" /> : <DollarSign className="h-4 w-4 text-muted-foreground" />}{app.type}</div></TableCell>
                  <TableCell>{app.title}</TableCell>
                  <TableCell>{new Date(app.submittedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="group" onClick={() => setSelectedApp(app)}>View Details <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /></Button>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden space-y-4">
          {filteredApplications.map((app: Application) => (
            <Card key={app._id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">{app.title}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>ID:</strong> {app._id.slice(-6).toUpperCase()}</p>
                <p><strong>Type:</strong> {app.type}</p>
                <p><strong>Submitted:</strong> {new Date(app.submittedDate).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 border-t pt-4">
                 <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedApp(app)}>View Details</Button>
                </DialogTrigger>
              </div>
            </Card>
          ))}
        </div>
      </>
    )
  }

  return (
    <Dialog onOpenChange={handleDialogChange}>
        <div className="space-y-8">
            <div><h1 className="text-3xl font-bold text-foreground">My Applications</h1><p className="text-muted-foreground">Track and manage all your job and loan applications here.</p></div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 md:w-[400px]"><TabsTrigger value="All">All</TabsTrigger><TabsTrigger value="Job">Job Applications</TabsTrigger><TabsTrigger value="Loan">Loan Applications</TabsTrigger></TabsList>
                <TabsContent value={activeTab}>
                <Card><CardHeader><CardTitle>Your Submitted Applications</CardTitle></CardHeader><CardContent>{renderContent()}</CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>

        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedApp && <ApplicationDetailsView application={selectedApp} />}
        </DialogContent>
    </Dialog>
  )
}