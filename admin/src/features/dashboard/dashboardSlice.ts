import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  { AxiosError } from "axios";
import axiosInstance from "@/shared/utils/axiosInstance";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/stats");
      return response.data.stats;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as Record<string, unknown>)?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

interface DashboardState {
  stats: {
    blogs: number;
    projects: number;
    skills: number;
    products: number;
    notes: number;
    services: number;
    certificates: number;
    contacts: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
