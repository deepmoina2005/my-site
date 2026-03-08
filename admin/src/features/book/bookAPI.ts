import axiosInstance from "@/utils/axiosInstance";
import type { BookResponse } from "@/types/book";

/* ===============================
   CREATE BOOK
================================ */
export const createBookService = async (data: FormData): Promise<BookResponse> => {
  const res = await axiosInstance.post("/books/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   GET ALL BOOKS
================================ */
export const getBooksService = async (): Promise<BookResponse> => {
  const res = await axiosInstance.get("/books");
  return res.data;
};

/* ===============================
   GET BOOK BY ID
================================ */
export const getBookByIdService = async (id: string): Promise<BookResponse> => {
  const res = await axiosInstance.get(`/books/${id}`);
  return res.data;
};

/* ===============================
   DELETE BOOK
================================ */
export const deleteBookService = async (id: string): Promise<BookResponse> => {
  const res = await axiosInstance.delete(`/books/${id}`);
  return res.data;
};
