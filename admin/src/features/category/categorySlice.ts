/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/categories";

export const fetchCategories = createAsyncThunk("categories/fetchAll", async (module: string | undefined, { rejectWithValue }) => {
  try {
    const url = module ? `${API_URL}?module=${module}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});

export const addCategory = createAsyncThunk("categories/add", async (data: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add");
  }
});

export const updateCategory = createAsyncThunk("categories/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});

const initialState = {
  categories: [] as any[],
  loading: false,
  error: null as string | null,
};

const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories || action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((item: any) => item._id !== action.payload);
      });
  },
});

export default slice.reducer;
