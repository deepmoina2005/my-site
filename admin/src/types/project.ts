import type { ReactNode } from "react";

/* ===============================
   Payload for creating/updating a project
================================ */
export interface ProjectPayload {
  name: string;
  description: string;
  skills: string[];
  liveLink?: string;
  codeLink?: string;
  startDate: string;    // ISO date string
  endDate?: string;     // ISO date string or undefined if ongoing
  associatedWith?: string;
  isOngoing: boolean;
  coverImage?: File;
  category?: string;
  features?: { title: string; description: string }[];
}

/* ===============================
   Project structure (as stored in DB)
================================ */
export interface Project {
  coverImage?: string;
  _id: string;
  name: string;
  description: string;
  skills: string[];
  liveLink?: string;
  codeLink?: string;
  startDate: string;     // ISO date string
  endDate?: string;
  associatedWith?: string;
  isOngoing: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
  features?: { title: string; description: string }[];
  status?: ReactNode;    // optional for frontend badges like "Ongoing" or "Completed"
}

/* ===============================
   API Response
================================ */
export interface ProjectResponse {
  success: boolean;
  message: string;
  project?: Project;
  projects?: Project[];
}

/* ===============================
   Redux State
================================ */
export interface ProjectState {
  projects: Project[];
  project: Project | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
