/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export const fetchServices = createAsyncThunk("services/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/services");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});

export const addService = createAsyncThunk("services/add", async (data: any, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/services", data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add");
  }
});

export const updateService = createAsyncThunk("services/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/services/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

export const deleteService = createAsyncThunk("services/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/services/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});

const initialState = {
  services: [],
  loading: false,
  error: null as string | null,
};

const slice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => { state.loading = true; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services || action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((item: any) => item._id !== action.payload);
      });
  },
});

export default slice.reducer;
