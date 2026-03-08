import express from "express";
import { createBook, deleteBook, getBookById, getBooks } from "../controllers/bookController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const bookRouter = express.Router();

// Create Book
bookRouter.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),
  createBook
);

// Get all books
bookRouter.get("/", getBooks);

// Get single book
bookRouter.get("/:id", getBookById);

// Delete book
bookRouter.delete("/:id", deleteBook);

export default bookRouter;