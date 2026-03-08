import express from "express";
import multer from "multer";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import isAuthenticated from "../middleware/authMiddleware.js";

const blogRouter = express.Router();

/* ===============================
   MULTER CONFIG (CLOUDINARY)
================================ */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

/* ===============================
   ROUTES
================================ */

// Create blog
blogRouter.post(
  "/create",
  isAuthenticated,             // optional
  upload.single("coverImage"),  // 👈 Cloudinary-ready
  createBlog
);

// Get all blogs
blogRouter.get("/", getBlogs);

// Get blog by slug
blogRouter.get("/:slug", getBlogBySlug);

// Update blog by slug
blogRouter.put(
  "/:slug",
  isAuthenticated,             // optional
  upload.single("coverImage"),  // optional new cover
  updateBlog
);

// Delete blog by slug
blogRouter.delete(
  "/:slug",
  isAuthenticated,             // optional
  deleteBlog
);

export default blogRouter;