"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store";
import { fetchApplicationDetailsForAdmin } from "@/lib/features/admin/adminSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-base text-foreground">{value || "N/A"}</p>
  </div>
);

export function AdminApplicationDetailsView({ appId, type }: { appId: string, type: 'job' | 'loan' }) {
  const dispatch = useAppDispatch();
  const { detailedApplication, detailedApplicationStatus: status } = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (appId && type) {
      dispatch(fetchApplicationDetailsForAdmin({ type, id: appId }));
    }
  }, [appId, type, dispatch]);

  if (status === "loading" || !detailedApplication) {
    return <div><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        {type === 'job' ? (
            <>
                <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Full Name" value={detailedApplication.fullName} />
                    <DetailItem label="Date of Birth" value={new Date(detailedApplication.dob).toLocaleDateString()} />
                    <DetailItem label="Phone" value={detailedApplication.phone} />
                    <DetailItem label="Email" value={detailedApplication.email} />
                    <DetailItem label="Full Address" value={`${detailedApplication.address}, ${detailedApplication.city}, ${detailedApplication.state} - ${detailedApplication.zip}`} />
                </CardContent></Card>
                 <Card><CardHeader><CardTitle>Professional Details</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Position Applied For" value={detailedApplication.position} />
                    <DetailItem label="Experience" value={`${detailedApplication.experience} years`} />
                    <DetailItem label="Current Salary (PA)" value={detailedApplication.currentSalary} />
                    <DetailItem label="Expected Salary (PA)" value={detailedApplication.expectedSalary} />
                    <DetailItem label="Current Location" value={detailedApplication.currentLocation} />
                    <DetailItem label="Notice Period" value={detailedApplication.noticePeriod} />
                </CardContent></Card>
            </>
        ) : (
             <>
                <Card><CardHeader><CardTitle>Personal & Contact</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Full Name" value={detailedApplication.fullName} />
                    <DetailItem label="PAN" value={detailedApplication.pan} />
                    <DetailItem label="Contact" value={detailedApplication.contact} />
                    <DetailItem label="Email" value={detailedApplication.email} />
                    <DetailItem label="Full Address" value={`${detailedApplication.address}, ${detailedApplication.city} - ${detailedApplication.postalCode}`} />
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Financial & Loan</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Job Title" value={detailedApplication.position} />
                    <DetailItem label="Monthly Income" value={detailedApplication.monthlyIncome} />
                    <DetailItem label="Loan Amount" value={detailedApplication.loanAmount} />
                    <DetailItem label="Loan Purpose" value={detailedApplication.loanPurpose} />
                </CardContent></Card>
             </>
        )}
    </div>
  );
}