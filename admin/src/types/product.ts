/* ===============================
   Payload for creating/updating a product
=============================== */
export interface ProductPayload {
  title: string;
  category: string;
  subject?: string;          // optional
  tags: string[];
  description?: string;      // optional
  visibility: "public" | "private";
  thumbnail?: File;          // optional, File type for frontend upload
}

/* ===============================
   Product returned from backend
=============================== */
export interface Product {
  status: "Active" | "Inactive";  // standardize status
  slug: string;                   // URL-friendly slug
  _id: string;
  title: string;
  category: string;
  subject?: string;
  tags: string[];
  description?: string;
  thumbnail?: string;             // URL of image
  visibility: "public" | "private";
  createdAt: string;
  updatedAt: string;
}

/* ===============================
   API response for product(s)
=============================== */
export interface ProductResponse {
  success: boolean;
  message: string;
  product?: Product;         // single product (for create/get by id)
  products?: Product[];      // array of products (for get all)
}

/* ===============================
   Redux slice state for products
=============================== */
export interface ProductState {
  products: Product[];
  product: Product | null;   // current product
  loading: boolean;
  success: boolean;
  error: string | null;
}
