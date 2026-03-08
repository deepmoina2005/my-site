import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/settings';

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(API_URL);
    return res.data.settings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load settings');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => { state.loading = true; })
      .addCase(fetchSettings.fulfilled, (state, action) => { state.loading = false; state.settings = action.payload; })
      .addCase(fetchSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default settingsSlice.reducer;
