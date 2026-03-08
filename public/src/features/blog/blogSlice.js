import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogAPI from './blogAPI';

export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await blogAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
  }
});

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.blogs = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
