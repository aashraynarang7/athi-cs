import { JobApplicationsTable } from "@/components/admin/JobApplicationsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminJobApplicationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Applications Management</h1>
          <p className="text-muted-foreground">View, manage, and filter all job applications.</p>
        </div>
      </div>
      
      <JobApplicationsTable />
    </div>
  );
}