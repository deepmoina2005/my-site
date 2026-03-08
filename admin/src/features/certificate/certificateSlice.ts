/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/certificates";

export const fetchCertificates = createAsyncThunk("certificates/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});

export const addCertificate = createAsyncThunk("certificates/add", async (data: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add");
  }
});

export const updateCertificate = createAsyncThunk("certificates/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

export const deleteCertificate = createAsyncThunk("certificates/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
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
