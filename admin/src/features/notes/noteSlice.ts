/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNoteService,
  getNotesService,
  getNoteByIdService,
  deleteNoteService,
} from "./notesAPI";
import type { NoteState, Note } from "@/types/note";

/* ===============================
   ASYNC THUNKS
================================ */

// CREATE NOTE
export const createNote = createAsyncThunk<
  { note: Note },
  FormData,
  { rejectValue: string | undefined }
>("notes/create", async (data, { rejectWithValue }) => {
  try {
    const response = await createNoteService(data);
    if (!response.note) throw new Error("Note data missing");
    return { note: response.note };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error creating note"
    );
  }
});

// GET ALL NOTES
export const getNotes = createAsyncThunk<
  { notes: Note[] },
  void,
  { rejectValue: string | undefined }
>("notes/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getNotesService();
    return { notes: response.notes || [] };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching notes"
    );
  }
});

// GET NOTE BY ID
export const getNoteById = createAsyncThunk<
  { note: Note },
  string,
  { rejectValue: string | undefined }
>("notes/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await getNoteByIdService(id);
    if (!response.note) throw new Error("Note data missing");
    return { note: response.note };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching note"
    );
  }
});

// DELETE NOTE
export const deleteNote = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string | undefined }
>("notes/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteNoteService(id);
    return { id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error deleting note"
    );
  }
});

/* ===============================
   INITIAL STATE
================================ */
const initialState: NoteState = {
  notes: [],
  note: null,
  loading: false,
  success: false,
  error: null,
};

/* ===============================
   SLICE
================================ */
const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNoteState: (state) => {
      state.note = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE NOTE */
      .addCase(createNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.notes.unshift(action.payload.note);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating note";
      })

      /* GET ALL NOTES */
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching notes";
      })

      /* GET NOTE BY ID */
      .addCase(getNoteById.pending, (state) => {
        state.loading = true;
        state.note = null;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.note = action.payload.note;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching note";
      })

      

      /* DELETE NOTE */
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.notes = state.notes.filter(
          (n) => n._id !== action.payload.id
        );
        if (state.note?._id === action.payload.id) {
          state.note = null;
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error deleting note";
      });
  },
});

export const { clearNoteState } = noteSlice.actions;
export default noteSlice.reducer;