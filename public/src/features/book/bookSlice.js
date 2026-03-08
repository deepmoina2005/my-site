import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookAPI from './bookAPI';

export const fetchBooks = createAsyncThunk('books/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await bookAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
  }
});

const initialState = {
  books: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.books = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
