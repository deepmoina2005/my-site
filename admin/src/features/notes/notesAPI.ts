import axiosInstance from "@/shared/utils/axiosInstance";
import type { NoteResponse } from "@/types/note";

/* ===============================
   CREATE NOTE
================================ */
export const createNoteService = async (
  data: FormData
): Promise<NoteResponse> => {
  const res = await axiosInstance.post("/notes/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   GET ALL NOTES
================================ */
export const getNotesService = async (): Promise<NoteResponse> => {
  const res = await axiosInstance.get("/notes");
  return res.data;
};

/* ===============================
   GET NOTE BY ID
================================ */
export const getNoteByIdService = async (
  id: string
): Promise<NoteResponse> => {
  const res = await axiosInstance.get(`/notes/${id}`);
  return res.data;
};

/* ===============================
   DELETE NOTE
================================ */
export const deleteNoteService = async (
  id: string
): Promise<NoteResponse> => {
  const res = await axiosInstance.delete(`/notes/${id}`);
  return res.data;
};
