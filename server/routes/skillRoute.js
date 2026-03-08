import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { createSkill, deleteSkill, getSkillById, getSkills, updateSkillLevel } from "../controllers/skillController.js";

const skillRouter = express.Router();

/* Create Skill */
skillRouter.post(
  "/create",
  upload.fields([{ name: "icon", maxCount: 1 }]),
  createSkill
);

/* Get all skills */
skillRouter.get("/", getSkills);

/* Get single skill */
skillRouter.get("/:id", getSkillById);

/* Delete skill */
skillRouter.delete("/:id", deleteSkill);

skillRouter.patch("/:id", updateSkillLevel) 

export default skillRouter;