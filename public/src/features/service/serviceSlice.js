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

export const fetchServiceById = createAsyncThunk('services/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await serviceAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch service');
  }
});

const initialState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.services = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.currentService = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentService } = slice.actions;
export default slice.reducer;
