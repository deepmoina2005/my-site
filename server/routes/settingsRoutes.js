import express from "express";
import multer from "multer";
import { getSettings, updateSettings, uploadSettingFile } from "../controllers/settingsController.js";
import isAuthenticated from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer – memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/jpg", "image/svg+xml",
      "image/x-icon", "image/webp",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("File type not allowed"), false);
  },
});

// Public – anyone can read settings
router.get("/", getSettings);

// Protected – only admin can update
router.put("/", isAuthenticated, updateSettings);
router.put("/upload", isAuthenticated, upload.single("file"), uploadSettingFile);

export default router;
