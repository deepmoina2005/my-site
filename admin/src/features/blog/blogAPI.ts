
import axiosInstance from "@/shared/utils/axiosInstance";
import type { BlogResponse } from "../../types/blog";

/* ===============================
   CREATE BLOG
================================ */
export const createBlogService = async (data: FormData): Promise<BlogResponse> => {
  const res = await axiosInstance.post("/blogs/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   GET ALL BLOGS
================================ */
export const getBlogsService = async (): Promise<BlogResponse> => {
  const res = await axiosInstance.get("/blogs");
  return res.data;
};

/* ===============================
   GET BLOG BY SLUG
================================ */
export const getBlogBySlugService = async (slug: string): Promise<BlogResponse> => {
  const res = await axiosInstance.get(`/blogs/${slug}`);
  return res.data;
};

/* ===============================
   UPDATE BLOG
================================ */
export const updateBlogService = async (slug: string, data: FormData): Promise<BlogResponse> => {
  const res = await axiosInstance.put(`/blogs/${slug}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   DELETE BLOG
================================ */
export const deleteBlogService = async (slug: string): Promise<BlogResponse> => {
  const res = await axiosInstance.delete(`/blogs/${slug}`);
  return res.data;
};
