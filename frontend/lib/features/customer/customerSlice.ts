import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/lib/api";

export interface Notification {
  _id: string;
  type: "update" | "message";
  text: string;
  timestamp: string;
  read: boolean;
  createdAt: string; 
}

export interface Application {
  _id: string;
  type: "Job" | "Loan";
  title: string;
  submittedDate: string;
  status: "Approved" | "In Review" | "Pending" | "Requires Action" | "Rejected";
}

interface DashboardData {
  user: { fullName: string };
  jobStats: { count: number; latestStatus: string };
  loanStats: { count: number; latestStatus: string };
  recentActivities: Notification[];
}

export interface ProfileData {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

interface CustomerState {
  dashboardData: DashboardData | null;
  applications: Application[];
  profile: ProfileData | null;
  notifications: Notification[];
  detailedApplication: any | null;
  detailedApplicationStatus: "idle" | "loading" | "succeeded" | "failed";
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CustomerState = {
  dashboardData: null,
  applications: [],
  profile: null,
  notifications: [],
  detailedApplication: null,
  detailedApplicationStatus: "idle",
  status: "idle",
  error: null,
};

export const getDashboardOverview = createAsyncThunk("customer/getDashboardOverview", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/customer/dashboard");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard data");
  }
});

export const getMyApplications = createAsyncThunk("customer/getMyApplications", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/customer/applications");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch applications");
  }
});

export const getProfileData = createAsyncThunk("customer/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/customer/profile");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

export const updateProfileData = createAsyncThunk("customer/updateProfile", async (profileData: Partial<ProfileData>, { rejectWithValue }) => {
  try {
    const response = await apiClient.put("/customer/profile", profileData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update profile");
  }
});

export const changePassword = createAsyncThunk("customer/changePassword", async (passwordData: any, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch("/customer/change-password", passwordData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to change password");
  }
});

export const getNotifications = createAsyncThunk("customer/getNotifications", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/customer/notifications");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
  }
});

export const markNotificationAsRead = createAsyncThunk("customer/markAsRead", async (id: string, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch(`/customer/notifications/${id}/read`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update notification");
  }
});

export const markAllNotificationsAsRead = createAsyncThunk("customer/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch("/customer/notifications/mark-all-read");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update notifications");
  }
});

export const deleteNotification = createAsyncThunk("customer/deleteNotification", async (id: string, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/customer/notifications/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete notification");
  }
});

export const fetchApplicationDetails = createAsyncThunk(
    "customer/fetchApplicationDetails",
    async ({ type, id }: { type: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/customer/applications/${type.toLowerCase()}/${id}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch details");
        }
    }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
     clearDetailedApplication: (state) => {
        state.detailedApplication = null;
        state.detailedApplicationStatus = "idle";
     }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardOverview.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(getDashboardOverview.fulfilled, (state, action: PayloadAction<DashboardData>) => { state.status = "succeeded"; state.dashboardData = action.payload; })
      .addCase(getDashboardOverview.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })

      .addCase(getMyApplications.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(getMyApplications.fulfilled, (state, action: PayloadAction<Application[]>) => { state.status = "succeeded"; state.applications = action.payload; })
      .addCase(getMyApplications.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })

      .addCase(getProfileData.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(getProfileData.fulfilled, (state, action: PayloadAction<ProfileData>) => { state.status = "succeeded"; state.profile = action.payload; })
      .addCase(getProfileData.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })
      
      .addCase(updateProfileData.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(updateProfileData.fulfilled, (state, action: PayloadAction<ProfileData>) => { state.status = "succeeded"; state.profile = action.payload; })
      .addCase(updateProfileData.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })

      .addCase(changePassword.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(changePassword.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(changePassword.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })

      .addCase(getNotifications.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(getNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => { state.status = "succeeded"; state.notifications = action.payload; })
      .addCase(getNotifications.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })
      
      .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<Notification>) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) { state.notifications[index] = action.payload; }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.read = true; });
      })
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      })

      .addCase(fetchApplicationDetails.pending, (state) => {
          state.detailedApplicationStatus = "loading";
      })
      .addCase(fetchApplicationDetails.fulfilled, (state, action: PayloadAction<any>) => {
          state.detailedApplicationStatus = "succeeded";
          state.detailedApplication = action.payload;
      })
      .addCase(fetchApplicationDetails.rejected, (state, action) => {
          state.detailedApplicationStatus = "failed";
          state.error = action.payload as string;
      });
  },
});

export const { clearDetailedApplication } = customerSlice.actions;
export default customerSlice.reducer;