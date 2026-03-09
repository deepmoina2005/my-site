/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "./projectAPI";
import type { ProjectState, Project, ProjectPayload } from "@/types/project";

/* ===============================
   ASYNC THUNKS
================================ */

// CREATE PROJECT
export const createProject = createAsyncThunk<
  { project: Project },
  ProjectPayload,
  { rejectValue: string | undefined }
>("projects/create", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    data.skills.forEach((skill) => formData.append("skills", skill));
    if (data.coverImage) formData.append("coverImage", data.coverImage);
    if (data.liveLink) formData.append("liveLink", data.liveLink);
    if (data.codeLink) formData.append("codeLink", data.codeLink);
    formData.append("startDate", data.startDate);
    if (data.endDate) formData.append("endDate", data.endDate);
    if (data.associatedWith)
      formData.append("associatedWith", data.associatedWith);
    formData.append("isOngoing", data.isOngoing.toString());
    if (data.features) formData.append("features", JSON.stringify(data.features));

    const response = await createProjectService(formData);
    if (!response.project) throw new Error("Project data missing");
    return { project: response.project };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error creating project",
    );
  }
});

// GET ALL PROJECTS
export const getProjects = createAsyncThunk<
  { projects: Project[] },
  void,
  { rejectValue: string | undefined }
>("projects/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getProjectsService();
    return { projects: response.projects || [] };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching projects",
    );
  }
});

// GET PROJECT BY ID
export const getProjectById = createAsyncThunk<
  { project: Project },
  string,
  { rejectValue: string | undefined }
>("projects/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await getProjectByIdService(id);
    if (!response.project) throw new Error("Project data missing");
    return { project: response.project };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching project",
    );
  }
});

// UPDATE PROJECT
export const updateProject = createAsyncThunk<
  { project: Project },
  { id: string; data: ProjectPayload },
  { rejectValue: string | undefined }
>("projects/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("skills", JSON.stringify(data.skills));
    if (data.coverImage) formData.append("coverImage", data.coverImage);
    if (data.liveLink) formData.append("liveLink", data.liveLink);
    if (data.codeLink) formData.append("codeLink", data.codeLink);
    formData.append("startDate", data.startDate);
    if (data.endDate) formData.append("endDate", data.endDate);
    if (data.associatedWith)
      formData.append("associatedWith", data.associatedWith);
    formData.append("isOngoing", data.isOngoing.toString());

    const response = await updateProjectService(id, formData);
    if (!response.project) throw new Error("Project data missing");
    return { project: response.project };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error updating project",
    );
  }
});

// DELETE PROJECT
export const deleteProject = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string | undefined }
>("projects/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteProjectService(id);
    return { id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error deleting project",
    );
  }
});

/* ===============================
   INITIAL STATE
================================ */
const initialState: ProjectState = {
  projects: [],
  project: null,
  loading: false,
  success: false,
  error: null,
};

/* ===============================
   SLICE
================================ */
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectState: (state) => {
      state.project = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE PROJECT
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.project)
          state.projects.unshift(action.payload.project);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating project";
      })

      // GET ALL PROJECTS
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects || [];
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching projects";
      })

      // GET PROJECT BY ID
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.project = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload.project || null;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching project";
      })

      // UPDATE PROJECT
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.project) {
          const index = state.projects.findIndex(
            (p) => p._id === action.payload.project._id,
          );
          if (index !== -1) state.projects[index] = action.payload.project;
          if (state.project?._id === action.payload.project._id)
            state.project = action.payload.project;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error updating project";
      })

      // DELETE PROJECT
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.projects = state.projects.filter(
          (p) => p._id !== action.payload.id,
        );
        if (state.project?._id === action.payload.id) state.project = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error deleting project";
      });
  },
});

export const { clearProjectState } = projectSlice.actions;
export default projectSlice.reducer;
