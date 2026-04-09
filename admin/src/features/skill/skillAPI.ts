import axiosInstance from "@/shared/utils/axiosInstance";
import type { SkillResponse } from "@/types/skill";

/* ===============================
   CREATE SKILL
================================ */
export const createSkillService = async (
  data: FormData
): Promise<SkillResponse> => {
  const res = await axiosInstance.post("/skills/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   GET ALL SKILLS
================================ */
export const getSkillsService = async (): Promise<SkillResponse> => {
  const res = await axiosInstance.get("/skills");
  return res.data;
};

/* ===============================
   GET SKILL BY ID
================================ */
export const getSkillByIdService = async (
  id: string
): Promise<SkillResponse> => {
  const res = await axiosInstance.get(`/skills/${id}`);
  return res.data;
};

/* ===============================
   DELETE SKILL
================================ */
export const deleteSkillService = async (
  id: string
): Promise<SkillResponse> => {
  const res = await axiosInstance.delete(`/skills/${id}`);
  return res.data;
};

/* ===============================
   UPDATE SKILL LEVEL
================================ */
export const updateSkillLevelService = async (
  id: string,
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Completed"
): Promise<SkillResponse> => {
  const res = await axiosInstance.patch(`/skills/${id}`, { level });
  return res.data;
};