import os
from pathlib import Path

PUBLIC_DIR = Path("v:/My Website/public/src")

features = [
    "blog", "project", "product", "service", "book", 
    "certificate", "education", "category", "experience", "skill"
]

slice_template = """import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {FEATURE_NAME}API from './{FEATURE_NAME}API';

export const fetch{FEATURE_NAME_CAP}s = createAsyncThunk('{FEATURE_NAME}s/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await {FEATURE_NAME}API.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch {FEATURE_NAME}s');
  }
});

const initialState = {
  {FEATURE_NAME}s: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: '{FEATURE_NAME}s',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch{FEATURE_NAME_CAP}s.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch{FEATURE_NAME_CAP}s.fulfilled, (state, action) => {
        state.loading = false;
        // The APIs often return { success: true, blogs: [...] } 
        // We will adapt this based on typical response shape
        const key = Object.keys(action.payload).find(k => k !== 'success');
        state.{FEATURE_NAME}s = key ? action.payload[key] : action.payload;
      })
      .addCase(fetch{FEATURE_NAME_CAP}s.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
"""

api_template = """import api from '@/shared/api/axios';

const {FEATURE_NAME}API = {
  getAll: () => api.get('/{API_PATH}'),
  getById: (id) => api.get(`/{API_PATH}/${id}`),
};

export default {FEATURE_NAME}API;
"""

api_paths = {
    "blog": "blogs",
    "project": "projects",
    "product": "products",
    "service": "services", # Will hit /api/services which doesn't exist yet but we'll add it
    "book": "books",
    "certificate": "certificates",
    "education": "educations", # or education
    "category": "categories",
    "experience": "experiences",
    "skill": "skills"
}

for feature in features:
    feature_dir = PUBLIC_DIR / "features" / feature
    
    # 1. Write Slice
    slice_content = slice_template.replace("{FEATURE_NAME}", feature).replace("{FEATURE_NAME_CAP}", feature.capitalize())
    with open(feature_dir / f"{feature}Slice.js", "w", encoding="utf-8") as f:
        f.write(slice_content)
        
    # 2. Write API
    api_path = api_paths.get(feature, f"{feature}s")
    api_content = api_template.replace("{FEATURE_NAME}", feature).replace("{API_PATH}", api_path)
    with open(feature_dir / f"{feature}API.js", "w", encoding="utf-8") as f:
        f.write(api_content)
        
print("Redux Slices and APIs scaffolded successfully.")
