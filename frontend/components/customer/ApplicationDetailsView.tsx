"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store";
import { fetchApplicationDetails } from "@/lib/features/customer/customerSlice";
import { Application } from "@/lib/features/customer/customerSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-base text-foreground">{value || "N/A"}</p>
  </div>
);

const DetailSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-6 w-1/3 mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
)

export function ApplicationDetailsView({ application }: { application: Application }) {
  const dispatch = useAppDispatch();
  const { detailedApplication, detailedApplicationStatus: status } = useAppSelector((state) => state.customer);

  useEffect(() => {
    if (application) {
      dispatch(fetchApplicationDetails({ type: application.type, id: application._id }));
    }
  }, [application, dispatch]);

  if (status === "loading" || !detailedApplication) {
    return <DetailSkeleton />;
  }
  
  const isJob = application.type === 'Job';

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        {isJob ? (
            <>
                <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Full Name" value={detailedApplication.fullName} />
                    <DetailItem label="Date of Birth" value={new Date(detailedApplication.dob).toLocaleDateString()} />
                    <DetailItem label="Gender" value={detailedApplication.gender} />
                    <DetailItem label="Phone Number" value={detailedApplication.phone} />
                    <DetailItem label="Email Address" value={detailedApplication.email} />
                    <DetailItem label="Home Address" value={`${detailedApplication.address}, ${detailedApplication.city}, ${detailedApplication.state} - ${detailedApplication.zip}`} />
                </CardContent></Card>
                 <Card><CardHeader><CardTitle>Job Details</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Position Applied For" value={detailedApplication.position} />
                    <DetailItem label="Total Experience" value={`${detailedApplication.experience} years`} />
                    <DetailItem label="Current Salary (PA)" value={detailedApplication.currentSalary} />
                    <DetailItem label="Expected Salary (PA)" value={detailedApplication.expectedSalary} />
                    <DetailItem label="Current Location" value={detailedApplication.currentLocation} />
                    <DetailItem label="Preferred Location" value={detailedApplication.preferLocation} />
                    <DetailItem label="Notice Period" value={detailedApplication.noticePeriod} />
                    <DetailItem label="Authorized to work?" value={detailedApplication.authorized ? "Yes" : "No"} />
                </CardContent></Card>
            </>
        ) : (
             <>
                <Card><CardHeader><CardTitle>Personal & Contact Details</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Full Name" value={detailedApplication.fullName} />
                    <DetailItem label="PAN No" value={detailedApplication.pan} />
                    <DetailItem label="Date of Birth" value={new Date(detailedApplication.dob).toLocaleDateString()} />
                    <DetailItem label="Gender" value={detailedApplication.gender} />
                    <DetailItem label="Marital Status" value={detailedApplication.maritalStatus} />
                    <DetailItem label="Contact Number" value={detailedApplication.contact} />
                    <DetailItem label="Email Address" value={detailedApplication.email} />
                    <DetailItem label="Full Address" value={`${detailedApplication.address}, ${detailedApplication.city}, ${detailedApplication.country} - ${detailedApplication.postalCode}`} />
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Financial & Loan Details</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Position/Job Title" value={detailedApplication.position} />
                    <DetailItem label="Employment Type" value={detailedApplication.employmentType} />
                    <DetailItem label="Monthly Income" value={detailedApplication.monthlyIncome} />
                    <DetailItem label="Requested Loan Amount" value={detailedApplication.loanAmount} />
                    <DetailItem label="Purpose of Loan" value={detailedApplication.loanPurpose} />
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Nominee Information</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Nominee Name" value={detailedApplication.nomineeName} />
                    <DetailItem label="Nominee Contact" value={detailedApplication.nomineeContact} />
                    <DetailItem label="Nominee Aadhaar" value={detailedApplication.nomineeAadhaar} />
                </CardContent></Card>
             </>
        )}
        {/* <Card><CardHeader><CardTitle>Payment Information</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Payment ID" value={detailedApplication.paymentDetails?.paymentId} />
            <DetailItem label="Order ID" value={detailedApplication.paymentDetails?.orderId} />
            <DetailItem label="Amount Paid" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(detailedApplication.paymentDetails?.amount || 0)} />
        </CardContent></Card> */}
    </div>
  );
}