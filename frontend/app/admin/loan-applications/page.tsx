import { LoanApplicationsTable } from "@/components/admin/LoanApplicationsTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function AdminLoanApplicationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loan Applications Management</h1>
          <p className="text-muted-foreground">View, manage, and filter all loan applications.</p>
        </div>
        {/* <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Application
        </Button> */}
      </div>
      
      <LoanApplicationsTable />
    </div>
  )
}