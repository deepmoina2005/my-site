/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createSkillService,
  getSkillsService,
  getSkillByIdService,
  deleteSkillService,
  updateSkillLevelService,
} from "@/features/skill/skillAPI";
import type { SkillState, Skill } from "@/types/skill";

/* ===============================
   ASYNC THUNKS
================================ */

// CREATE SKILL
export const createSkill = createAsyncThunk<
  { skill: Skill },
  FormData,
  { rejectValue: string | undefined }
>("skills/create", async (data, { rejectWithValue }) => {
  try {
    const response = await createSkillService(data);
    if (!response.skill) throw new Error("Skill data missing");
    return { skill: response.skill };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error creating skill",
    );
  }
});

// GET ALL SKILLS
export const getSkills = createAsyncThunk<
  { skills: Skill[] },
  void,
  { rejectValue: string | undefined }
>("skills/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getSkillsService();
    return { skills: response.skills || [] };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching skills",
    );
  }
});

// GET SKILL BY ID
export const getSkillById = createAsyncThunk<
  { skill: Skill },
  string,
  { rejectValue: string | undefined }
>("skills/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await getSkillByIdService(id);
    if (!response.skill) throw new Error("Skill data missing");
    return { skill: response.skill };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching skill",
    );
  }
});

// DELETE SKILL
export const deleteSkill = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string | undefined }
>("skills/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteSkillService(id);
    return { id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error deleting skill",
    );
  }
});

// UPDATE SKILL LEVEL
export const updateSkillLevel = createAsyncThunk<
  { id: string; level: Skill["level"] },
  { id: string; level: Skill["level"] },
  { rejectValue: string }
>("skills/updateLevel", async ({ id, level }, { rejectWithValue }) => {
  try {
    await updateSkillLevelService(id, level);
    return { id, level };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error updating skill level",
    );
  }
});

/* ===============================
   INITIAL STATE
================================ */
const initialState: SkillState = {
  skills: [],
  skill: null,
  loading: false,
  success: false,
  error: null,
};

/* ===============================
   SLICE
================================ */
const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearSkillState: (state) => {
      state.skill = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE SKILL */
      .addCase(createSkill.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.skills.unshift(action.payload.skill);
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating skill";
      })

      /* GET ALL SKILLS */
      .addCase(getSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload.skills;
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching skills";
      })

      /* GET SKILL BY ID */
      .addCase(getSkillById.pending, (state) => {
        state.loading = true;
        state.skill = null;
      })
      .addCase(getSkillById.fulfilled, (state, action) => {
        state.loading = false;
        state.skill = action.payload.skill;
      })
      .addCase(getSkillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching skill";
      })

      /* DELETE SKILL */
      .addCase(deleteSkill.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.skills = state.skills.filter((s) => s._id !== action.payload.id);
        if (state.skill?._id === action.payload.id) {
          state.skill = null;
        }
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error deleting skill";
      })

      /* UPDATE SKILL LEVEL */
      .addCase(updateSkillLevel.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSkillLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = state.skills.map((s) =>
          s._id === action.payload.id
            ? { ...s, level: action.payload.level }
            : s,
        );
        if (state.skill?._id === action.payload.id) {
          state.skill.level = action.payload.level;
        }
      })
      .addCase(updateSkillLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error updating skill level";
      });
  },
});

export const { clearSkillState } = skillSlice.actions;
export default skillSlice.reducer;
