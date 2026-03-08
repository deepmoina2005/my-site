import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import educationAPI from './educationAPI';

export const fetchEducations = createAsyncThunk('educations/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await educationAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch educations');
  }
});

const initialState = {
  educations: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'educations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducations.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.educations = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchEducations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
