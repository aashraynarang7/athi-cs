import { Users, FileText, Clock, CheckCircle } from "lucide-react"

export const statsCards = [
  {
    title: "Total Users",
    icon: Users,
    value: "1,250",
    change: "+15.2% from last month",
    isPrimary: false,
  },
  {
    title: "Total Applications",
    icon: FileText,
    value: "8,420",
    change: "+8.1% from last month",
    isPrimary: false,
  },
  {
    title: "Pending Applications",
    icon: Clock,
    value: "316",
    change: "Action Required",
    isPrimary: true,
  },
  {
    title: "Approved This Month",
    icon: CheckCircle,
    value: "242",
    change: "+21.9% from last month",
    isPrimary: false,
  },
]

export const recentApplications = [
  { id: "APP-001", name: "Chetan Nada", type: "Job", status: "Pending", date: "2024-05-15" },
  { id: "APP-002", name: "Priya Sharma", type: "Loan", status: "In Review", date: "2024-05-15" },
  { id: "APP-003", name: "Arjun Kumar", type: "Job", status: "Pending", date: "2024-05-14" },
  { id: "APP-004", name: "Neha Singh", type: "Loan", status: "Requires Action", date: "2024-05-14" },
  { id: "APP-005", name: "Raj Patel", type: "Job", status: "Approved", date: "2024-05-13" },
]

export const applicationsChartData = [
  { date: "May 1", Job: 25, Loan: 15 },
  { date: "May 5", Job: 30, Loan: 20 },
  { date: "May 10", Job: 45, Loan: 25 },
  { date: "May 15", Job: 40, Loan: 35 },
  { date: "May 20", Job: 55, Loan: 40 },
  { date: "May 25", Job: 60, Loan: 45 },
]

export const statusPieChartData = [
  { status: "Pending", count: 316, fill: "hsl(var(--chart-1))" },
  { status: "In Review", count: 450, fill: "hsl(var(--chart-2))" },
  { status: "Approved", count: 1200, fill: "hsl(var(--chart-3))" },
  { status: "Rejected", count: 210, fill: "hsl(var(--chart-4))" },
]


export type JobApplicationStatus = "Pending" | "In Review" | "Approved" | "Rejected";

export interface JobApplication {
  id: string;
  applicantName: string;
  position: string;
  submissionDate: string;
  status: JobApplicationStatus;
  assignedTo: string;
}

export const jobApplications: JobApplication[] = [
  { id: "APP-001", applicantName: "Chetan Nada", position: "Senior Software Engineer", submissionDate: "2024-05-15", status: "Pending", assignedTo: "Admin" },
  { id: "APP-003", applicantName: "Arjun Kumar", position: "Product Manager", submissionDate: "2024-05-14", status: "In Review", assignedTo: "Admin" },
  { id: "APP-005", applicantName: "Raj Patel", position: "UI/UX Designer", submissionDate: "2024-05-13", status: "Approved", assignedTo: "Admin" },
  { id: "APP-006", applicantName: "Sonia Gupta", position: "Data Analyst", submissionDate: "2024-05-12", status: "Rejected", assignedTo: "Admin" },
  { id: "APP-007", applicantName: "Amit Verma", position: "Frontend Developer", submissionDate: "2024-05-11", status: "Pending", assignedTo: "Admin" },
  { id: "APP-008", applicantName: "Priya Singh", position: "Backend Developer", submissionDate: "2024-05-10", status: "In Review", assignedTo: "Admin" },
  { id: "APP-009", applicantName: "Rahul Mehta", position: "DevOps Engineer", submissionDate: "2024-05-09", status: "Approved", assignedTo: "Admin" },
  { id: "APP-010", applicantName: "Anjali Desai", position: "QA Engineer", submissionDate: "2024-05-08", status: "Pending", assignedTo: "Admin" },
];


export type LoanApplicationStatus = "Pending" | "In Review" | "Approved" | "Rejected";

export interface LoanApplication {
  id: string;
  applicantName: string;
  loanAmount: number;
  loanPurpose: string;
  submissionDate: string;
  status: LoanApplicationStatus;
  assignedTo: string;
}

export const loanApplications: LoanApplication[] = [
  { id: "APP-002", applicantName: "Priya Sharma", loanAmount: 500000, loanPurpose: "Home Loan", submissionDate: "2024-05-15", status: "In Review", assignedTo: "Admin" },
  { id: "APP-004", applicantName: "Neha Singh", loanAmount: 75000, loanPurpose: "Personal Loan", submissionDate: "2024-05-14", status: "Pending", assignedTo: "Admin" },
  { id: "APP-011", applicantName: "Vijay Kumar", loanAmount: 1200000, loanPurpose: "Car Loan", submissionDate: "2024-05-13", status: "Approved", assignedTo: "Admin" },
  { id: "APP-012", applicantName: "Sunita Reddy", loanAmount: 200000, loanPurpose: "Education Loan", submissionDate: "2024-05-12", status: "Rejected", assignedTo: "Admin" },
  { id: "APP-013", applicantName: "Manoj Tiwari", loanAmount: 350000, loanPurpose: "Business Loan", submissionDate: "2024-05-11", status: "Pending", assignedTo: "Admin" },
  { id: "APP-014", applicantName: "Kavita Nair", loanAmount: 80000, loanPurpose: "Personal Loan", submissionDate: "2024-05-10", status: "In Review", assignedTo: "Admin" },
];

export type UserStatus = "Active" | "Inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  registrationDate: string;
  applicationCount: number;
  status: UserStatus;
}

export const users: User[] = [
  { id: "USR-001", name: "Chetan Nada", email: "chetan@example.com", avatarUrl: "https://i.pravatar.cc/150?u=chetan", registrationDate: "2024-05-01", applicationCount: 3, status: "Active" },
  { id: "USR-002", name: "Priya Sharma", email: "priya@example.com", avatarUrl: "https://i.pravatar.cc/150?u=priya", registrationDate: "2024-04-28", applicationCount: 2, status: "Active" },
  { id: "USR-003", name: "Arjun Kumar", email: "arjun@example.com", avatarUrl: "https://i.pravatar.cc/150?u=arjun", registrationDate: "2024-04-25", applicationCount: 1, status: "Active" },
  { id: "USR-004", name: "Neha Singh", email: "neha@example.com", avatarUrl: "https://i.pravatar.cc/150?u=neha", registrationDate: "2024-04-22", applicationCount: 5, status: "Inactive" },
  { id: "USR-005", name: "Raj Patel", email: "raj@example.com", avatarUrl: "https://i.pravatar.cc/150?u=raj", registrationDate: "2024-04-20", applicationCount: 2, status: "Active" },
  { id: "USR-006", name: "Sonia Gupta", email: "sonia@example.com", avatarUrl: "https://i.pravatar.cc/150?u=sonia", registrationDate: "2024-04-18", applicationCount: 0, status: "Active" },
];

export const kpiData = [
  { title: "Overall Success Rate", value: "75.3%", change: "+2.5% this month", icon: "TrendingUp" },
  { title: "Avg. Approval Time", value: "5.2 Days", change: "-0.5 days this month", icon: "Clock" },
  { title: "Total Applications (Period)", value: "1,234", change: "+120 from last period", icon: "FileText" },
]

export const areaChartData = [
  { date: "May 1", Job: 25, Loan: 15 }, { date: "May 5", Job: 30, Loan: 20 },
  { date: "May 10", Job: 45, Loan: 25 }, { date: "May 15", Job: 40, Loan: 35 },
  { date: "May 20", Job: 55, Loan: 40 }, { date: "May 25", Job: 60, Loan: 45 },
  { date: "May 30", Job: 75, Loan: 50 },
]

export const topJobsData = [
  { position: "Software Engineer", applications: 120 },
  { position: "Product Manager", applications: 85 },
  { position: "UI/UX Designer", applications: 70 },
  { position: "Data Analyst", applications: 60 },
  { position: "DevOps Engineer", applications: 45 },
]

export const loanSuccessData = [
  { type: "Home", rate: 85 }, { type: "Personal", rate: 78 },
  { type: "Car", rate: 92 }, { type: "Business", rate: 65 },
  { type: "Education", rate: 88 },
]

export type AdminRole = "Admin" | "Super Admin" | "Viewer";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: AdminRole;
  status: "Active" | "Inactive";
}

export const adminUsers: AdminUser[] = [
  { id: "ADM-001", name: "Admin User", email: "admin@example.com", avatarUrl: "https://i.pravatar.cc/150?u=admin", role: "Super Admin", status: "Active" },
  { id: "ADM-002", name: "Jane Doe", email: "jane@example.com", avatarUrl: "https://i.pravatar.cc/150?u=jane", role: "Admin", status: "Active" },
  { id: "ADM-003", name: "John Smith", email: "john@example.com", avatarUrl: "https://i.pravatar.cc/150?u=john", role: "Viewer", status: "Inactive" },
];