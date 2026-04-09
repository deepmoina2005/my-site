/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/shared/utils/axiosInstance";

export const fetchCertificates = createAsyncThunk("certificates/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/certificates");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});

export const addCertificate = createAsyncThunk("certificates/add", async (data: any, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/certificates", data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add");
  }
});

export const updateCertificate = createAsyncThunk("certificates/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/certificates/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

export const deleteCertificate = createAsyncThunk("certificates/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/certificates/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});

const initialState = {
  certificates: [],
  loading: false,
  error: null as string | null,
};

const slice = createSlice({
  name: "certificates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => { state.loading = true; })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.certificates || action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.certificates = state.certificates.filter((item: any) => item._id !== action.payload);
      });
  },
});

export default slice.reducer;
