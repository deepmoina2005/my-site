/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBookService,
  getBooksService,
  getBookByIdService,
  deleteBookService,
} from "./bookAPI";
import type { BookState, Book } from "@/types/book";

/* ===============================
   ASYNC THUNKS
================================ */

// CREATE BOOK
export const createBook = createAsyncThunk<
  { book: Book },
  FormData,
  { rejectValue: string | undefined }
>("books/create", async (data, { rejectWithValue }) => {
  try {
    const response = await createBookService(data);
    if (!response.book) throw new Error("Book data missing");
    return { book: response.book };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error creating book");
  }
});

// GET ALL BOOKS
export const getBooks = createAsyncThunk<
  { books: Book[] },
  void,
  { rejectValue: string | undefined }
>("books/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getBooksService();
    return { books: response.books || [] };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error fetching books");
  }
});

// GET BOOK BY ID
export const getBookById = createAsyncThunk<
  { book: Book },
  string,
  { rejectValue: string | undefined }
>("books/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await getBookByIdService(id);
    if (!response.book) throw new Error("Book data missing");
    return { book: response.book };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error fetching book");
  }
});

// DELETE BOOK
export const deleteBook = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string | undefined }
>("books/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteBookService(id);
    return { id };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error deleting book");
  }
});

/* ===============================
   INITIAL STATE
================================ */
const initialState: BookState = {
  books: [],
  book: null,
  loading: false,
  success: false,
  error: null,
};

/* ===============================
   SLICE
================================ */
const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearBookState: (state) => {
      state.book = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE BOOK */
      .addCase(createBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.books.unshift(action.payload.book);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating book";
      })

      /* GET ALL BOOKS */
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching books";
      })

      /* GET BOOK BY ID */
      .addCase(getBookById.pending, (state) => {
        state.loading = true;
        state.book = null;
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload.book;
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching book";
      })

      /* DELETE BOOK */
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.books = state.books.filter((b) => b._id !== action.payload.id);
        if (state.book?._id === action.payload.id) {
          state.book = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error deleting book";
      });
  },
});

export const { clearBookState } = bookSlice.actions;
export default bookSlice.reducer;