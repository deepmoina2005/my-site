import type { ReactNode } from "react";

export interface BlogPayload {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  coverImage?: File;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface Blog {
  status: string;
  views: ReactNode;
  date: ReactNode;
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  coverImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  blog?: Blog;
  blogs?: Blog[];
}

export interface BlogState {
  blogs: Blog[];
  blog: Blog | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
