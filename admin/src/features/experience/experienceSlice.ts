/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Experience,
  ExperienceState,
} from "@/types/experience";
import {
  createExperienceService,
  getExperiencesService,
  getExperienceByIdService,
  deleteExperienceService,
  updateExperienceService,
} from "@/features/experience/experienceAPI";

/* ===============================
   ASYNC THUNKS
================================ */

// CREATE
export const createExperience = createAsyncThunk<
  { experience: Experience },
  FormData,
  { rejectValue: string }
>("experiences/create", async (data, { rejectWithValue }) => {
  try {
    const res = await createExperienceService(data);
    if (!res.experience) throw new Error("Experience missing");
    return { experience: res.experience };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error creating experience",
    );
  }
});

// GET ALL
export const getExperiences = createAsyncThunk<
  { experiences: Experience[] },
  void,
  { rejectValue: string }
>("experiences/getAll", async (_, { rejectWithValue }) => {
  try {
    const res = await getExperiencesService();
    return { experiences: res.experiences || [] };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching experiences",
    );
  }
});

// GET BY ID
export const getExperienceById = createAsyncThunk<
  { experience: Experience },
  string,
  { rejectValue: string }
>("experiences/getById", async (id, { rejectWithValue }) => {
  try {
    const res = await getExperienceByIdService(id);
    if (!res.experience) throw new Error("Experience missing");
    return { experience: res.experience };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching experience",
    );
  }
});

// DELETE
export const deleteExperience = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("experiences/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteExperienceService(id);
    return { id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error deleting experience",
    );
  }
});

// UPDATE
export const updateExperience = createAsyncThunk<
  { experience: Experience },
  { id: string; data: FormData },
  { rejectValue: string }
>("experiences/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateExperienceService(id, data);
    if (!res.experience) throw new Error("Experience missing");
    return { experience: res.experience };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error updating experience",
    );
  }
});

/* ===============================
   INITIAL STATE
================================ */
const initialState: ExperienceState = {
  experiences: [],
  experience: null,
  loading: false,
  success: false,
  error: null,
};

/* ===============================
   SLICE
================================ */
const experienceSlice = createSlice({
  name: "experiences",
  initialState,
  reducers: {
    clearExperienceState: (state) => {
      state.experience = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.experiences.unshift(action.payload.experience);
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Create failed";
      })

      /* GET ALL */
      .addCase(getExperiences.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload.experiences;
      })
      .addCase(getExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fetch failed";
      })

      /* GET BY ID */
      .addCase(getExperienceById.pending, (state) => {
        state.loading = true;
        state.experience = null;
      })
      .addCase(getExperienceById.fulfilled, (state, action) => {
        state.loading = false;
        state.experience = action.payload.experience;
      })

      /* DELETE */
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter(
          (e) => e._id !== action.payload.id,
        );
      })

      /* UPDATE */
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.map((e) =>
          e._id === action.payload.experience._id
            ? action.payload.experience
            : e,
        );
        state.experience = action.payload.experience;
      });
  },
});

export const { clearExperienceState } = experienceSlice.actions;
export default experienceSlice.reducer;