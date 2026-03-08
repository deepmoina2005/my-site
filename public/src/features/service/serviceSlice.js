import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceAPI from './serviceAPI';

export const fetchServices = createAsyncThunk('services/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await serviceAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
  }
});

const initialState = {
  services: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.services = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
