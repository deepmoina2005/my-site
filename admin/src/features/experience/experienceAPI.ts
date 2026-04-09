import axiosInstance from "@/shared/utils/axiosInstance";
import type { ExperienceResponse } from "@/types/experience";

/* ===============================
   CREATE EXPERIENCE
================================ */
export const createExperienceService = async (
  data: FormData,
): Promise<ExperienceResponse> => {
  const res = await axiosInstance.post("/experiences/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   GET ALL EXPERIENCES
================================ */
export const getExperiencesService = async (): Promise<ExperienceResponse> => {
  const res = await axiosInstance.get("/experiences");
  return res.data;
};

/* ===============================
   GET EXPERIENCE BY ID
================================ */
export const getExperienceByIdService = async (
  id: string,
): Promise<ExperienceResponse> => {
  const res = await axiosInstance.get(`/experiences/${id}`);
  return res.data;
};

/* ===============================
   DELETE EXPERIENCE
================================ */
export const deleteExperienceService = async (
  id: string,
): Promise<ExperienceResponse> => {
  const res = await axiosInstance.delete(`/experiences/${id}`);
  return res.data;
};

/* ===============================
   UPDATE EXPERIENCE
================================ */
export const updateExperienceService = async (
  id: string,
  data: FormData,
): Promise<ExperienceResponse> => {
  const res = await axiosInstance.put(`/experiences/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
