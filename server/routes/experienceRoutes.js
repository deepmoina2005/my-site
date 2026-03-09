import express from "express";
import { createExperience, deleteExperience, getExperienceById, getExperiences, updateExperience } from "../controllers/experienceController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const experienceRouter = express.Router();

/* Create experience */
experienceRouter.post(
  "/create",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  createExperience
);

/* Get all */
experienceRouter.get("/", getExperiences);

/* Get single */
experienceRouter.get("/:id", getExperienceById);

/* Update */
experienceRouter.patch("/:id", upload.fields([{ name: "logo", maxCount: 1 }]), updateExperience);

/* Delete */
experienceRouter.delete("/:id", deleteExperience);

export default experienceRouter;