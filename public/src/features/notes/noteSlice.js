import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteAPI from './noteAPI';

export const fetchNotes = createAsyncThunk('notes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await noteAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch notes');
  }
});

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both { success: true, notes: [...] } and direct array
        state.notes = action.payload.notes || action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
