"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { fetchLoanApplications, LoanApplication, clearDetailedApplication } from "@/lib/features/admin/adminSlice"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AdminApplicationDetailsView } from "./AdminApplicationDetailsView"
import { ArrowUpDown, MoreHorizontal, FileDown, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/lib/api"
import { exportToExcel } from "@/lib/excel.utils"

export function LoanApplicationsTable() {
  const dispatch = useAppDispatch()
  const { loanApplications, loanPagination, loanApplicationsStatus } = useAppSelector((state: RootState) => state.admin)
  const [selectedApp, setSelectedApp] = React.useState<LoanApplication | null>(null);
  const [isExporting, setIsExporting] = React.useState(false)
  const { toast } = useToast()
  
  const columns = React.useMemo<ColumnDef<LoanApplication>[]>(() => [
    { id: "select", header: ({ table }) => (<Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />), cell: ({ row }) => (<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />), enableSorting: false },
    { accessorKey: "applicantName", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Applicant Name <ArrowUpDown className="ml-2 h-4 w-4" /></Button>) },
    { accessorKey: "loanAmount", header: "Loan Amount", cell: ({ row }) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.getValue("loanAmount")) },
    { accessorKey: "loanPurpose", header: "Purpose" },
    { accessorKey: "submissionDate", header: "Submission Date", cell: ({ row }) => new Date(row.getValue("submissionDate")).toLocaleDateString() },
    { id: "actions", cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
           <DialogTrigger asChild><DropdownMenuItem onSelect={() => setSelectedApp(row.original)}>View Details</DropdownMenuItem></DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ], [])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    const debouncedFetch = setTimeout(() => {
      dispatch(fetchLoanApplications({ page: pageIndex + 1, limit: pageSize, search: searchTerm, sortBy: sorting[0]?.id, sortOrder: sorting[0]?.desc ? 'desc' : 'asc' }))
    }, 300)
    return () => clearTimeout(debouncedFetch)
  }, [dispatch, pageIndex, pageSize, sorting, searchTerm])

  const handleExport = async () => {
    setIsExporting(true)
    toast({ description: "Preparing all loan applications for download..." })
    try {
      const response = await apiClient.get("/admin/loan-applications/export")
      exportToExcel(response.data.data, "Loan_Applications_Export")
      toast({ title: "Success!", description: "Your file has started downloading." })
    } catch (error) {
      toast({ title: "Export Failed", description: "Could not download the data. Please try again.", variant: "destructive" })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) { setSelectedApp(null); dispatch(clearDetailedApplication()) }
  }

  const table = useReactTable({
    data: loanApplications, columns, pageCount: loanPagination.totalPages ?? -1,
    state: { sorting, rowSelection, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting, onRowSelectionChange: setRowSelection, onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(), manualPagination: true, manualSorting: true, manualFiltering: true,
  })

  return (
    <Dialog onOpenChange={handleDialogChange}>
      <div className="w-full">
        <div className="flex items-center py-4 gap-4">
          <Input placeholder="Filter by applicant name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Download All
            </Button>
          </div>
        </div>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
            <TableBody>
              {loanApplicationsStatus === "loading" ? ( Array.from({ length: pageSize }).map((_, i) => (<TableRow key={i}><TableCell colSpan={columns.length}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)) ) : 
                table.getRowModel().rows?.length ? ( table.getRowModel().rows.map((r) => (<TableRow key={r.id}>{r.getVisibleCells().map((c) => (<TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>))}</TableRow>)) ) : 
                (<TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell></TableRow>)
              }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">{Object.keys(rowSelection).length} of {loanPagination.totalDocuments} row(s) selected.</div>
          <div className="space-x-2"><Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button><Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button></div>
        </div>
      </div>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Loan Application Details</DialogTitle></DialogHeader>
        {selectedApp && <AdminApplicationDetailsView appId={selectedApp._id} type="loan" />}
      </DialogContent>
    </Dialog>
  )
}