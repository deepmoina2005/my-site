import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import skillAPI from './skillAPI';

export const fetchSkills = createAsyncThunk('skills/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await skillAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
  }
});

const initialState = {
  skills: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.skills = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
