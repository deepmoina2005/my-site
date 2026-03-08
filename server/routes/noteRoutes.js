import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  deleteNote,
} from "../controllers/noteController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const notesRouter = express.Router();

/* ===============================
   ROUTES
================================ */

// Create Note
notesRouter.post(
  "/create",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createNote
);

// Get all notes
notesRouter.get("/", getNotes);

// Get single note
notesRouter.get("/:id", getNoteById);

// Delete note
notesRouter.delete("/:id", deleteNote);

export default notesRouter;