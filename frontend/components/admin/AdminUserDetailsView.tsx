"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store";
import { fetchUserDetailsForAdmin } from "@/lib/features/admin/adminSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-base text-foreground">{value || "N/A"}</p>
  </div>
);

export function AdminUserDetailsView({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const { detailedUser, detailedUserStatus: status } = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetailsForAdmin(userId));
    }
  }, [userId, dispatch]);

  if (status === "loading" || !detailedUser) {
    return <div><Skeleton className="h-96 w-full" /></div>;
  }
  
  const { user, jobApps, loanApps } = detailedUser;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="User ID" value={user._id} />
                <DetailItem label="Phone Number" value={user.phoneNumber} />
                <DetailItem label="Role" value={user.role} />
                <DetailItem label="Registration Date" value={new Date(user.createdAt).toLocaleDateString()} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Job Applications ({jobApps.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {jobApps.length > 0 ? jobApps.map((app: any) => (
                    <div key={app._id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <p>{app.position}</p>
                        <Badge>{app.status}</Badge>
                    </div>
                )) : <p className="text-muted-foreground">No job applications found.</p>}
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Loan Applications ({loanApps.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {loanApps.length > 0 ? loanApps.map((app: any) => (
                    <div key={app._id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <p>{app.loanPurpose}</p>
                        <Badge>{app.status}</Badge>
                    </div>
                )) : <p className="text-muted-foreground">No loan applications found.</p>}
            </CardContent>
        </Card>
    </div>
  );
}