/* ===============================
   Payload for creating/updating a skill
=============================== */
export interface SkillPayload {
  name: string;
  description?: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Completed";
  link?: string;
  tags: string[];
  icon?: File; // optional icon upload
}

/* ===============================
   Skill returned from backend
=============================== */
export interface Skill {
  _id: string;
  name: string;
  description?: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Completed";
  link?: string;
  tags: string[];
  icon?: string; // Cloudinary URL
  createdAt: string;
  updatedAt: string;
}

/* ===============================
   API response for skill(s)
=============================== */
export interface SkillResponse {
  success: boolean;
  message: string;
  skill?: Skill;      // single skill
  skills?: Skill[];   // all skills
}

/* ===============================
   Redux slice state for skills
=============================== */
export interface SkillState {
  skills: Skill[];
  skill: Skill | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
