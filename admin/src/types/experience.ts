/* ===============================
   Experience Proof (links only)
=============================== */
export interface ExperienceProof {
  title: string; // Offer Letter / Certificate / Internship Proof
  url: string;   // Google Drive / Public link
}

/* ===============================
   Payload for creating/updating experience
=============================== */
export interface ExperiencePayload {
  title: string;
  company: string;
  workMode: "Onsite" | "Remote" | "Hybrid";
  location?: string;
  startDate: string;
  endDate?: string | null;
  isOngoing: boolean;
  category?: string;
  tags: string[];
  description?: string;
  visibility: "public" | "private";
  proofs: ExperienceProof[];
  logo?: File; // optional logo upload
}

/* ===============================
   Experience returned from backend
=============================== */
export interface Experience {
  _id: string;
  title: string;
  company: string;
  workMode: "Onsite" | "Remote" | "Hybrid";
  location?: string;
  startDate: string;
  endDate?: string | null;
  isOngoing: boolean;
  category?: string;
  tags: string[];
  description?: string;
  visibility: "public" | "private";
  logo?: string; // Cloudinary URL
  proofs: ExperienceProof[];
  createdAt: string;
  updatedAt: string;
}

/* ===============================
   API response
=============================== */
export interface ExperienceResponse {
  success: boolean;
  message?: string;
  experience?: Experience;
  experiences?: Experience[];
}

/* ===============================
   Redux slice state
=============================== */
export interface ExperienceState {
  experiences: Experience[];
  experience: Experience | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
