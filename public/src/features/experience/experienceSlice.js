import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import experienceAPI from './experienceAPI';

export const fetchExperiences = createAsyncThunk('experiences/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await experienceAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch experiences');
  }
});

const initialState = {
  experiences: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload.experiences || [];
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
