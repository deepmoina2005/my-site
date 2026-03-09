import express from "express";
import { getAllEducationS, getEducationById, createEducation, updateEducation, deleteEducation } from "../controllers/educationController.js";
import { upload } from "../middleware/uploadMiddleware.js"; // Assuming upload middleware is defined here

const router = express.Router();

router.get("/", getAllEducationS);
router.get("/:id", getEducationById);
router.post("/", upload.fields([{ name: "logo", maxCount: 1 }]), createEducation);
router.put("/:id", upload.fields([{ name: "logo", maxCount: 1 }]), updateEducation);
router.delete("/:id", deleteEducation);

export default router;
