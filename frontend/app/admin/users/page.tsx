import { UserManagementTable } from "@/components/admin/UserManagementTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">View, manage, and search all registered users.</p>
        </div>
        {/* <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button> */}
      </div>
      
      <UserManagementTable />
    </div>
  )
}