/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/contacts";

export const fetchContacts = createAsyncThunk("contacts/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});

export const updateContactStatus = createAsyncThunk("contacts/updateStatus", async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { status });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update status");
  }
});

export const deleteContact = createAsyncThunk("contacts/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});

const initialState = {
  contacts: [] as any[],
  loading: false,
  error: null as string | null,
};

const slice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => { state.loading = true; })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts || action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const index = state.contacts.findIndex((c) => c._id === action.payload.contact._id);
        if (index !== -1) {
          state.contacts[index] = action.payload.contact;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((c) => c._id !== action.payload);
      });
  },
});

export default slice.reducer;
