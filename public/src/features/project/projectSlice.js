import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectAPI from './projectAPI';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await projectAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
  }
});

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.projects = key ? action.payload[key] : action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
