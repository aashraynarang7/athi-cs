"use client"

import * as React from "react"
import { ColumnDef, SortingState, flexRender, getCoreRowModel, useReactTable, PaginationState } from "@tanstack/react-table"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { fetchUsers, User, deleteUser, clearDetailedUser } from "@/lib/features/admin/adminSlice"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AdminUserDetailsView } from "./AdminUserDetailsView"
import { useToast } from "@/components/ui/use-toast"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = { Active: "bg-green-100 text-green-800 border-green-200", Inactive: "bg-gray-100 text-gray-800 border-gray-200" }

export function UserManagementTable() {
  const dispatch = useAppDispatch()
  const { users, userPagination, usersStatus } = useAppSelector((state: RootState) => state.admin)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const { toast } = useToast();

  const handleDeleteUser = async () => {
      if (!selectedUser) return;
      try {
          await dispatch(deleteUser(selectedUser._id)).unwrap();
          toast({ title: "Success", description: "User deleted successfully." });
      } catch (error: any) {
          toast({ title: "Error", description: error || "Failed to delete user.", variant: "destructive" });
      }
      setIsDeleteOpen(false);
  };
  
  const columns = React.useMemo<ColumnDef<User>[]>(() => [
    { id: "select", header: ({ table }) => (<Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />), cell: ({ row }) => (<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />), enableSorting: false },
    {
      accessorKey: "name",
      header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>User <ArrowUpDown className="ml-2 h-4 w-4" /></Button>),
      cell: ({ row }) => { const u = row.original; return (<div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarFallback>{u.name.charAt(0)}</AvatarFallback></Avatar><div><div className="font-medium">{u.name}</div><div className="text-sm text-muted-foreground">{u.email}</div></div></div>) }
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline" className={cn(statusColors[row.getValue("status") as string])}>{row.getValue("status")}</Badge> },
    { accessorKey: "registrationDate", header: "Registration Date", cell: ({ row }) => new Date(row.getValue("registrationDate")).toLocaleDateString() },
    { accessorKey: "applicationCount", header: "Applications", cell: ({ row }) => <div className="text-center font-medium">{row.getValue("applicationCount")}</div> },
    { id: "actions", cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => { setSelectedUser(row.original); setIsViewOpen(true); }}>View Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => { setSelectedUser(row.original); setIsDeleteOpen(true); }} className="text-red-500">Delete User</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ], [])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [searchTerm, setSearchTerm] = React.useState("")

  const queryParams = React.useMemo(() => ({
    page: pageIndex + 1,
    limit: pageSize,
    search: searchTerm,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  }), [pageIndex, pageSize, searchTerm, sorting]);

  React.useEffect(() => {
    const debouncedFetch = setTimeout(() => { dispatch(fetchUsers(queryParams)) }, 300)
    return () => clearTimeout(debouncedFetch)
  }, [dispatch, queryParams])

  const table = useReactTable({
    data: users,
    columns,
    pageCount: userPagination.totalPages ?? -1,
    state: { sorting, rowSelection, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4"><Input placeholder="Filter by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
            <TableBody>
              {usersStatus === "loading" ? ( Array.from({ length: pageSize }).map((_, i) => (<TableRow key={i}><TableCell colSpan={columns.length}><Skeleton className="h-10 w-full" /></TableCell></TableRow>)) ) : 
                table.getRowModel().rows?.length ? ( table.getRowModel().rows.map((r) => (<TableRow key={r.id} data-state={r.getIsSelected() && "selected"}>{r.getVisibleCells().map((c) => (<TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>))}</TableRow>)) ) : 
                (<TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell></TableRow>)
              }
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">{Object.keys(rowSelection).length} of {userPagination.totalDocuments} row(s) selected.</div>
          <div className="space-x-2"><Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button><Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button></div>
        </div>
      </div>
      
      <Dialog open={isViewOpen} onOpenChange={(open) => {
          setIsViewOpen(open);
          if (!open) dispatch(clearDetailedUser());
      }}>
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                  <DialogTitle>User Profile Details</DialogTitle>
              </DialogHeader>
              {selectedUser && <AdminUserDetailsView userId={selectedUser._id} />}
          </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user and all their associated applications.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  )
}