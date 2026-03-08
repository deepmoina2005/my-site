import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryAPI from './categoryAPI';

export const fetchCategorys = createAsyncThunk('categorys/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await categoryAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch categorys');
  }
});

const initialState = {
  categorys: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'categorys',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorys.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.categorys = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchCategorys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
