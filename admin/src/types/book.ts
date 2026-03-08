

export interface BookPayload {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description?: string;
  visibility: "public" | "private";
  bookFile: File;
  thumbnail?: File;
}

export interface Book {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description?: string;
  visibility: "public" | "private";
  bookFileUrl: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookResponse {
  success: boolean;
  message: string;
  book?: Book;
  books?: Book[];
}

export interface BookState {
  books: Book[];
  book: Book | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
