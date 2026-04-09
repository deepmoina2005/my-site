import axiosInstance from "@/shared/utils/axiosInstance";
import type { ProjectResponse } from "@/types/project";

/* ===============================
   CREATE PROJECT
================================ */
export const createProjectService = async (data: FormData): Promise<ProjectResponse> => {
  const res = await axiosInstance.post("/projects/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   GET ALL PROJECTS
================================ */
export const getProjectsService = async (): Promise<ProjectResponse> => {
  const res = await axiosInstance.get("/projects");
  return res.data;
};

/* ===============================
   GET PROJECT BY ID
================================ */
export const getProjectByIdService = async (id: string): Promise<ProjectResponse> => {
  const res = await axiosInstance.get(`/projects/${id}`);
  return res.data;
};

/* ===============================
   UPDATE PROJECT
================================ */
export const updateProjectService = async (id: string, data: FormData): Promise<ProjectResponse> => {
  const res = await axiosInstance.put(`/projects/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   DELETE PROJECT
================================ */
export const deleteProjectService = async (id: string): Promise<ProjectResponse> => {
  const res = await axiosInstance.delete(`/projects/${id}`);
  return res.data;
};
