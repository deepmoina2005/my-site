import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import certificateAPI from './certificateAPI';

export const fetchCertificates = createAsyncThunk('certificates/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await certificateAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificates');
  }
});

const initialState = {
  certificates: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.certificates = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
