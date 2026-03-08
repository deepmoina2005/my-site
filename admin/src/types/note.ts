import type { ReactNode } from "react";

export interface NotePayload {
  title: string;
  category: string;
  subject: string;
  course?: string;
  semester?: string;
  tags: string[];
  description?: string;
  visibility: "public" | "private";
  file: File;
  thumbnail?: File;
}

export interface Note {
  file: string;
  status?: ReactNode;
  date?: ReactNode;
  _id: string;
  title: string;
  category: string;
  subject: string;
  course?: string;
  semester?: string;
  tags: string[];
  description?: string;
  fileUrl: string;
  thumbnail?: string;
  visibility: "public" | "private";
  createdAt: string;
  updatedAt: string;
}

export interface NoteResponse {
  success: boolean;
  message: string;
  note?: Note;
  notes?: Note[];
}

export interface NoteState {
  notes: Note[];
  note: Note | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
