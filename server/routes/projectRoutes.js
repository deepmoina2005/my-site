import express from "express";
import multer from "multer";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import isAuthenticated from "../middleware/authMiddleware.js";

const projectRouter = express.Router();

/* ===============================
   MULTER CONFIG (MEMORY STORAGE)
================================ */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png, mp4, pdf allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

/* ===============================
   ROUTES
================================ */

// Create project
// Accept coverImage (single) + media (multiple)
projectRouter.post(
  "/create",
  isAuthenticated, // optional
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  createProject
);

// Get all projects
projectRouter.get("/", getProjects);

// Get single project by ID
projectRouter.get("/:id", getProjectById);

// Update project by ID
// Accept optional new coverImage + media
projectRouter.put(
  "/:id",
  isAuthenticated, // optional
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  updateProject
);

// Delete project by ID
projectRouter.delete(
  "/:id",
  isAuthenticated, // optional
  deleteProject
);

export default projectRouter;
