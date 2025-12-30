"use client"

import * as React from "react"
import { ColumnDef, SortingState, flexRender, getCoreRowModel, useReactTable, PaginationState } from "@tanstack/react-table"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { fetchInquiries, replyToInquiry, ContactInquiry } from "@/lib/features/admin/adminSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpDown, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = { New: "bg-blue-100 text-blue-800", Replied: "bg-green-100 text-green-800" }

const ReplyDialog = ({ inquiry }: { inquiry: ContactInquiry }) => {
    const [replyMessage, setReplyMessage] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const handleSendReply = async () => {
        if (!replyMessage.trim()) {
            toast({ title: "Reply message cannot be empty.", variant: "destructive" });
            return;
        }
        setIsSending(true);
        try {
            await dispatch(replyToInquiry({ id: inquiry._id, replyMessage })).unwrap();
            toast({ title: "Success", description: "Your reply has been sent." });
            setReplyMessage("");
            // You might want to close the dialog here, handled by the parent's `onOpenChange`
        } catch (error: any) {
            toast({ title: "Error", description: error || "Failed to send reply.", variant: "destructive" });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Reply to Inquiry</DialogTitle>
                <DialogDescription>Your reply will be sent to {inquiry.email}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="p-4 bg-muted rounded-md border">
                    <p className="text-sm font-medium">{inquiry.name} ({inquiry.email})</p>
                    <p className="text-sm text-muted-foreground mt-1">Subject: {inquiry.subject}</p>
                    <blockquote className="mt-2 pl-4 border-l-2 text-sm">{inquiry.message}</blockquote>
                </div>
                <div>
                    <Label htmlFor="reply-message" className="text-right">Your Reply</Label>
                    <Textarea id="reply-message" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="min-h-[150px]" />
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleSendReply} disabled={isSending}>
                    {isSending ? "Sending..." : "Send Reply"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export function ContactInquiriesTable() {
    const dispatch = useAppDispatch()
    const { contactInquiries, inquiryPagination, inquiriesStatus } = useAppSelector((state: RootState) => state.admin)

    const columns = React.useMemo<ColumnDef<ContactInquiry>[]>(() => [
        { accessorKey: "name", header: "From", cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-sm text-muted-foreground">{row.original.email}</p></div> },
        { accessorKey: "subject", header: "Subject" },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge className={cn(statusColors[row.getValue("status") as string])}>{row.getValue("status")}</Badge> },
        { accessorKey: "createdAt", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date <ArrowUpDown className="ml-2 h-4 w-4" /></Button>), cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString() },
        { id: "actions", cell: ({ row }) => (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Mail className="mr-2 h-4 w-4" /> Reply</Button>
                </DialogTrigger>
                <ReplyDialog inquiry={row.original} />
            </Dialog>
        )},
    ], [])

    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'createdAt', desc: true }])
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const [searchTerm, setSearchTerm] = React.useState("")

    const queryParams = React.useMemo(() => ({
        page: pageIndex + 1,
        limit: pageSize,
        search: searchTerm,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    }), [pageIndex, pageSize, searchTerm, sorting])

    React.useEffect(() => {
        const debouncedFetch = setTimeout(() => { dispatch(fetchInquiries(queryParams)) }, 300)
        return () => clearTimeout(debouncedFetch)
    }, [dispatch, queryParams])

    const table = useReactTable({
        data: contactInquiries,
        columns,
        pageCount: inquiryPagination.totalPages ?? -1,
        state: { sorting, pagination: { pageIndex, pageSize } },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4"><Input placeholder="Search by name, email, subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
                    <TableBody>
                        {inquiriesStatus === "loading" ? (Array.from({ length: pageSize }).map((_, i) => (<TableRow key={i}><TableCell colSpan={columns.length}><Skeleton className="h-10 w-full" /></TableCell></TableRow>))) :
                            table.getRowModel().rows?.length ? (table.getRowModel().rows.map((r) => (<TableRow key={r.id}>{r.getVisibleCells().map((c) => (<TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>))}</TableRow>))) :
                            (<TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No inquiries found.</TableCell></TableRow>)
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">{inquiryPagination.totalDocuments} inquiry(s).</div>
                <div className="space-x-2"><Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button><Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button></div>
            </div>
        </div>
    )
}