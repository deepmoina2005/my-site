/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/slices/adminSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  adminLoginService,
  adminLogoutService,
  changePasswordService,
  changeAdminIdService,
} from "./loginAPI";

import type {
    AdminLoginPayload,
    ChangePasswordPayload,
    ChangeAdminIdPayload,
    AdminState,
} from "@/types/admin";


export const adminLogin = createAsyncThunk<
  any,
  AdminLoginPayload,
  { rejectValue: string }
>("admin/login", async (data, { rejectWithValue }) => {
  try {
    return await adminLoginService(data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const adminLogout = createAsyncThunk("admin/logout", async () => {
  return await adminLogoutService();
});

export const changeAdminPassword = createAsyncThunk<
  any,
  ChangePasswordPayload,
  { rejectValue: string }
>("admin/changePassword", async (data, { rejectWithValue }) => {
  try {
    return await changePasswordService(data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error");
  }
});

export const changeAdminId = createAsyncThunk<
  any,
  ChangeAdminIdPayload,
  { rejectValue: string }
>("admin/changeAdminId", async (data, { rejectWithValue }) => {
  try {
    return await changeAdminIdService(data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error");
  }
});

const initialState: AdminState = {
  token: localStorage.getItem("adminToken"),
  loading: false,
  success: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
        localStorage.setItem("adminToken", action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      // LOGOUT
      .addCase(adminLogout.fulfilled, (state) => {
        state.token = null;
        localStorage.removeItem("adminToken");
      })

      // CHANGE PASSWORD / ID
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
          state.success = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearState } = adminSlice.actions;
export default adminSlice.reducer;