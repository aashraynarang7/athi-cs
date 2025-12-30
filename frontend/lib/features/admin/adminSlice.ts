import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/lib/api";

export interface JobApplication { _id: string; applicantName: string; position: string; submissionDate: string; status: string; assignedTo: string; }
export interface LoanApplication { _id: string; applicantName: string; loanAmount: number; loanPurpose: string; submissionDate: string; status: string; }
export interface User { _id: string; name: string; email: string; avatarUrl: string; registrationDate: string; applicationCount: number; status: "Active" | "Inactive"; }
export interface AdminUser { _id: string; name: string; email: string; avatarUrl: string; role: "Admin" | "Super Admin" | "Viewer"; status: "Active" | "Inactive"; }
export interface WebsiteSettings { siteName: string; maintenanceMode: boolean; applicationFee: number; }
export interface AnalyticsData { kpiData: any[]; areaChartData: any[]; topJobsData: any[]; }
export interface DashboardOverviewData { statsCards: any[]; recentApplications: any[]; statusPieChartData: any[]; }
export interface ContactInquiry { _id: string; name: string; email: string; subject: string; message: string; status: string; createdAt: string; }
interface Pagination { currentPage: number; totalPages: number; totalDocuments: number; }

type SliceStatus = "idle" | "loading" | "succeeded" | "failed";

interface AdminState {
  jobApplications: JobApplication[];
  loanApplications: LoanApplication[];
  users: User[];
  adminUsers: AdminUser[];
  websiteSettings: WebsiteSettings | null;
  analyticsData: AnalyticsData | null;
  dashboardOverview: DashboardOverviewData | null;
  contactInquiries: ContactInquiry[];
  detailedApplication: any | null;
  detailedUser: any | null;
  
  jobPagination: Pagination;
  loanPagination: Pagination;
  userPagination: Pagination;
  inquiryPagination: Pagination;
  
  jobApplicationsStatus: SliceStatus;
  loanApplicationsStatus: SliceStatus;
  usersStatus: SliceStatus;
  dashboardStatus: SliceStatus;
  analyticsStatus: SliceStatus;
  settingsStatus: SliceStatus;
  inquiriesStatus: SliceStatus;
  detailedApplicationStatus: SliceStatus;
  detailedUserStatus: SliceStatus;

  error: string | null;
}

const initialPagination = { currentPage: 1, totalPages: 1, totalDocuments: 0 };

const initialState: AdminState = {
  jobApplications: [], 
  loanApplications: [], 
  users: [], 
  adminUsers: [], 
  websiteSettings: null, 
  analyticsData: null, 
  dashboardOverview: null,
  contactInquiries: [],
  detailedApplication: null,
  detailedUser: null,
  jobPagination: initialPagination, 
  loanPagination: initialPagination, 
  userPagination: initialPagination,
  inquiryPagination: initialPagination,
  jobApplicationsStatus: "idle", 
  loanApplicationsStatus: "idle", 
  usersStatus: "idle", 
  dashboardStatus: "idle", 
  analyticsStatus: "idle", 
  settingsStatus: "idle",
  inquiriesStatus: "idle",
  detailedApplicationStatus: "idle",
  detailedUserStatus: "idle",
  error: null,
};

export const fetchJobApplications = createAsyncThunk("admin/fetchJobApplications", async (params: any, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/job-applications", { params }); return r.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchLoanApplications = createAsyncThunk("admin/fetchLoanApplications", async (params: any, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/loan-applications", { params }); return r.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (params: any, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/users", { params }); return r.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchDashboardOverview = createAsyncThunk("admin/fetchDashboardOverview", async (_, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/dashboard"); return r.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchAnalytics = createAsyncThunk("admin/fetchAnalytics", async (params: { startDate: string; endDate: string }, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/analytics", { params }); return r.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchAdminUsers = createAsyncThunk("admin/fetchAdminUsers", async (_, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/settings/admins"); return r.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const addAdminUser = createAsyncThunk("admin/addAdminUser", async (userData: any, { rejectWithValue }) => { try { const r = await apiClient.post("/admin/settings/admins", userData); return r.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchWebsiteSettings = createAsyncThunk("admin/fetchWebsiteSettings", async (_, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/settings/website"); return r.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const updateWebsiteSettings = createAsyncThunk("admin/updateWebsiteSettings", async (settings: Partial<WebsiteSettings>, { rejectWithValue }) => { try { const r = await apiClient.put("/admin/settings/website", settings); return r.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchInquiries = createAsyncThunk("admin/fetchInquiries", async (params: any, { rejectWithValue }) => { try { const r = await apiClient.get("/admin/inquiries", { params }); return r.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const replyToInquiry = createAsyncThunk("admin/replyToInquiry", async ({ id, replyMessage }: { id: string, replyMessage: string }, { rejectWithValue }) => { try { const r = await apiClient.post(`/admin/inquiries/${id}/reply`, { replyMessage }); return r.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchApplicationDetailsForAdmin = createAsyncThunk( "admin/fetchApplicationDetails", async ({ type, id }: { type: 'job' | 'loan', id: string }, { rejectWithValue }) => { try { const response = await apiClient.get(`/admin/${type}-applications/${id}`); return response.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const updateApplicationStatus = createAsyncThunk( "admin/updateApplicationStatus", async ({ type, id, status }: { type: 'job' | 'loan', id: string, status: string }, { rejectWithValue }) => { try { const response = await apiClient.patch(`/admin/${type}-applications/${id}/status`, { status }); return response.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const fetchUserDetailsForAdmin = createAsyncThunk("admin/fetchUserDetails", async (id: string, { rejectWithValue }) => { try { const response = await apiClient.get(`/admin/users/${id}`); return response.data.data; } catch (e: any) { return rejectWithValue(e.response.data.message); } });
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id: string, { rejectWithValue }) => { try { await apiClient.delete(`/admin/users/${id}`); return id; } catch (e: any) { return rejectWithValue(e.response.data.message); } });

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
      clearDetailedApplication: (state) => {
          state.detailedApplication = null;
          state.detailedApplicationStatus = "idle";
      },
      clearDetailedUser: (state) => {
          state.detailedUser = null;
          state.detailedUserStatus = "idle";
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobApplications.pending, (state) => { state.jobApplicationsStatus = "loading"; })
      .addCase(fetchJobApplications.fulfilled, (state, action) => { state.jobApplicationsStatus = "succeeded"; state.jobApplications = action.payload.data; state.jobPagination = action.payload.pagination; })
      .addCase(fetchJobApplications.rejected, (state, action) => { state.jobApplicationsStatus = "failed"; state.error = action.payload as string; })

      .addCase(fetchLoanApplications.pending, (state) => { state.loanApplicationsStatus = "loading"; })
      .addCase(fetchLoanApplications.fulfilled, (state, action) => { state.loanApplicationsStatus = "succeeded"; state.loanApplications = action.payload.data; state.loanPagination = action.payload.pagination; })
      .addCase(fetchLoanApplications.rejected, (state, action) => { state.loanApplicationsStatus = "failed"; state.error = action.payload as string; })

      .addCase(fetchUsers.pending, (state) => { state.usersStatus = "loading"; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.usersStatus = "succeeded"; state.users = action.payload.data; state.userPagination = action.payload.pagination; })
      .addCase(fetchUsers.rejected, (state, action) => { state.usersStatus = "failed"; state.error = action.payload as string; })

      .addCase(fetchDashboardOverview.pending, (state) => { state.dashboardStatus = "loading"; })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => { state.dashboardStatus = "succeeded"; state.dashboardOverview = action.payload; })
      .addCase(fetchDashboardOverview.rejected, (state, action) => { state.dashboardStatus = "failed"; state.error = action.payload as string; })

      .addCase(fetchAnalytics.pending, (state) => { state.analyticsStatus = "loading"; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => { state.analyticsStatus = "succeeded"; state.analyticsData = action.payload; })
      .addCase(fetchAnalytics.rejected, (state, action) => { state.analyticsStatus = "failed"; state.error = action.payload as string; })
      
      .addCase(fetchAdminUsers.pending, (state) => { state.settingsStatus = "loading"; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.settingsStatus = "succeeded"; state.adminUsers = action.payload; })
      .addCase(fetchAdminUsers.rejected, (state, action) => { state.settingsStatus = "failed"; state.error = action.payload as string; })
      
      .addCase(addAdminUser.pending, (state) => { state.settingsStatus = "loading"; })
      .addCase(addAdminUser.fulfilled, (state, action) => { state.settingsStatus = "succeeded"; state.adminUsers.push(action.payload); })
      .addCase(addAdminUser.rejected, (state, action) => { state.settingsStatus = "failed"; state.error = action.payload as string; })

      .addCase(fetchWebsiteSettings.pending, (state) => { state.settingsStatus = "loading"; })
      .addCase(fetchWebsiteSettings.fulfilled, (state, action) => { state.settingsStatus = "succeeded"; state.websiteSettings = action.payload; })
      .addCase(fetchWebsiteSettings.rejected, (state, action) => { state.settingsStatus = "failed"; state.error = action.payload as string; })

      .addCase(updateWebsiteSettings.pending, (state) => { state.settingsStatus = "loading"; })
      .addCase(updateWebsiteSettings.fulfilled, (state, action) => { state.settingsStatus = "succeeded"; state.websiteSettings = action.payload; })
      .addCase(updateWebsiteSettings.rejected, (state, action) => { state.settingsStatus = "failed"; state.error = action.payload as string; })
      
      .addCase(fetchInquiries.pending, (state) => { state.inquiriesStatus = "loading"; })
      .addCase(fetchInquiries.fulfilled, (state, action) => { state.inquiriesStatus = "succeeded"; state.contactInquiries = action.payload.data; state.inquiryPagination = action.payload.pagination; })
      .addCase(fetchInquiries.rejected, (state, action) => { state.inquiriesStatus = "failed"; state.error = action.payload as string; })

      .addCase(replyToInquiry.fulfilled, (state, action: PayloadAction<ContactInquiry>) => {
        const index = state.contactInquiries.findIndex(inquiry => inquiry._id === action.payload._id);
        if (index !== -1) { state.contactInquiries[index] = action.payload; }
      })

      .addCase(fetchApplicationDetailsForAdmin.pending, (state) => { state.detailedApplicationStatus = "loading"; })
      .addCase(fetchApplicationDetailsForAdmin.fulfilled, (state, action) => { state.detailedApplicationStatus = "succeeded"; state.detailedApplication = action.payload; })
      .addCase(fetchApplicationDetailsForAdmin.rejected, (state, action) => { state.detailedApplicationStatus = "failed"; state.error = action.payload as string; })

      .addCase(updateApplicationStatus.fulfilled, (state, action: PayloadAction<any>) => {
          state.detailedApplication = action.payload;
          const updatedApp = action.payload;
          
          let list: (JobApplication[] | LoanApplication[]) | undefined;
          if (updatedApp.position) {
              list = state.jobApplications;
          } else {
              list = state.loanApplications;
          }
          if (list) {
              const index = list.findIndex(app => app._id === updatedApp._id);
              if (index !== -1) {
                  (list as any[])[index].status = updatedApp.status;
              }
          }
      })

      .addCase(fetchUserDetailsForAdmin.pending, (state) => { state.detailedUserStatus = "loading"; })
      .addCase(fetchUserDetailsForAdmin.fulfilled, (state, action) => { state.detailedUserStatus = "succeeded"; state.detailedUser = action.payload; })
      .addCase(fetchUserDetailsForAdmin.rejected, (state, action) => { state.detailedUserStatus = "failed"; state.error = action.payload as string; })
      
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
          state.users = state.users.filter(user => user._id !== action.payload);
      });
  },
});

export const { clearDetailedApplication, clearDetailedUser } = adminSlice.actions;
export default adminSlice.reducer;