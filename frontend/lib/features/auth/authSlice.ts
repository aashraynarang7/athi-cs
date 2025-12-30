import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/api";

interface AuthState {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: "admin" | "customer";
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk("auth/registerUser", async (userData: any, { rejectWithValue }) => {
  try { const response = await apiClient.post("/auth/register", userData); return response.data; }
  catch (error: any) { return rejectWithValue(error.response?.data?.message || "Registration failed"); }
});

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (data: { otp: string }, { rejectWithValue }) => {
  try { const response = await apiClient.post("/auth/verify-email", data); return response.data; }
  catch (error: any) { return rejectWithValue(error.response?.data?.message || "Verification failed"); }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials: any, { rejectWithValue }) => {
  try { const response = await apiClient.post("/auth/login", credentials); return response.data; }
  catch (error: any) { return rejectWithValue(error.response?.data?.message || "Login failed"); }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try { await apiClient.post("/auth/logout"); }
  catch (error: any) { return rejectWithValue("Logout failed"); }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (data: { email: string }, { rejectWithValue }) => {
  try { const response = await apiClient.post("/auth/forgot-password", data); return response.data; }
  catch (error: any) { return rejectWithValue(error.response?.data?.message || "Failed to send reset link"); }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (data: { token: string; password: string }, { rejectWithValue }) => {
  try { const response = await apiClient.patch(`/auth/reset-password/${data.token}`, { password: data.password }); return response.data; }
  catch (error: any) { return rejectWithValue(error.response?.data?.message || "Failed to reset password"); }
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/auth/profile");
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue("Not authenticated");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;