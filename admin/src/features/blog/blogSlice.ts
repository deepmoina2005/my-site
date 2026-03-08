/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBlogService,
  getBlogsService,
  getBlogBySlugService,
  updateBlogService,
  deleteBlogService,
} from "./blogAPI";
import type { BlogState, Blog } from "@/types/blog";

/* ===============================
   ASYNC THUNKS
================================ */

// CREATE BLOG
export const createBlog = createAsyncThunk<
  { blog: Blog },
  FormData,
  { rejectValue: string | undefined }
>("blogs/create", async (data, { rejectWithValue }) => {
  try {
    const response = await createBlogService(data);
    if (!response.blog) throw new Error("Blog data missing");
    return { blog: response.blog };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error creating blog");
  }
});

// GET ALL BLOGS
export const getBlogs = createAsyncThunk<
  { blogs: Blog[] },
  void,
  { rejectValue: string | undefined }
>("blogs/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getBlogsService();
    return { blogs: response.blogs || [] };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error fetching blogs");
  }
});

// GET BLOG BY SLUG
export const getBlogBySlug = createAsyncThunk<
  { blog: Blog },
  string,
  { rejectValue: string | undefined }
>("blogs/getBySlug", async (slug, { rejectWithValue }) => {
  try {
    const response = await getBlogBySlugService(slug);
    if (!response.blog) throw new Error("Blog data missing");
    return { blog: response.blog };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error fetching blog");
  }
});

// UPDATE BLOG
export const updateBlog = createAsyncThunk<
  { blog: Blog },
  { slug: string; data: FormData },
  { rejectValue: string | undefined }
>("blogs/update", async ({ slug, data }, { rejectWithValue }) => {
  try {
    const response = await updateBlogService(slug, data);
    if (!response.blog) throw new Error("Blog data missing");
    return { blog: response.blog };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error updating blog");
  }
});

// DELETE BLOG
export const deleteBlog = createAsyncThunk<
  { slug: string },
  string,
  { rejectValue: string | undefined }
>("blogs/delete", async (slug, { rejectWithValue }) => {
  try {
    await deleteBlogService(slug);
    return { slug };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Error deleting blog");
  }
});

/* ===============================
   INITIAL STATE
================================ */
const initialState: BlogState = {
  blogs: [],
  blog: null,
  loading: false,
  success: false,
  error: null,
};

/* ===============================
   SLICE
================================ */
const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogState: (state) => {
      state.blog = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         CREATE BLOG
      ================================ */
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.blog) state.blogs.unshift(action.payload.blog);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating blog";
      })

      /* ===============================
         GET ALL BLOGS
      ================================ */
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs || [];
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching blogs";
      })

      /* ===============================
         GET BLOG BY SLUG
      ================================ */
      .addCase(getBlogBySlug.pending, (state) => {
        state.loading = true;
        state.blog = null;
      })
      .addCase(getBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload.blog || null;
      })
      .addCase(getBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching blog";
      })

      /* ===============================
         UPDATE BLOG
      ================================ */
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.blog) {
          const index = state.blogs.findIndex(b => b.slug === action.payload.blog.slug);
          if (index !== -1) state.blogs[index] = action.payload.blog;
          if (state.blog?.slug === action.payload.blog.slug) state.blog = action.payload.blog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error updating blog";
      })

      /* ===============================
         DELETE BLOG
      ================================ */
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blogs = state.blogs.filter(b => b.slug !== action.payload.slug);
        if (state.blog?.slug === action.payload.slug) state.blog = null;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error deleting blog";
      });
  },
});

export const { clearBlogState } = blogSlice.actions;
export default blogSlice.reducer;