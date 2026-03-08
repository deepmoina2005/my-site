/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/educations";

export const fetchEducations = createAsyncThunk("educations/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});

export const addEducation = createAsyncThunk("educations/add", async (data: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add");
  }
});

export const updateEducation = createAsyncThunk("educations/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

export const deleteEducation = createAsyncThunk("educations/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});

const initialState = {
  educations: [],
  loading: false,
  error: null as string | null,
};

const slice = createSlice({
  name: "educations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducations.pending, (state) => { state.loading = true; })
      .addCase(fetchEducations.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = action.payload.educations || action.payload;
      })
      .addCase(fetchEducations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.educations = state.educations.filter((item: any) => item._id !== action.payload);
      });
  },
});

export default slice.reducer;
