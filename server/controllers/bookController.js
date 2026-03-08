import Book from "../models/bookModel.js"
import { cloudinary } from "../configs/cloudinary.js"

/* ===============================
   CREATE BOOK
================================ */
export const createBook = async (req, res) => {
  try {
    const { title, slug, category, tags, description, visibility, file } = req.body

    // Validate required fields
    if (!title || !slug || !category || !file) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, category, and book file link are required",
      })
    }

    // ---------- THUMBNAIL UPLOAD ----------
    let thumbnailUrl = ""
    if (req.files?.thumbnail) {
      const thumbFile = req.files.thumbnail[0]
      const uploadThumb = await cloudinary.uploader.upload(
        `data:${thumbFile.mimetype};base64,${thumbFile.buffer.toString("base64")}`,
        { folder: "books/thumbnails", resource_type: "image" }
      )
      thumbnailUrl = uploadThumb.secure_url
    }

    // ---------- SAVE BOOK ----------
    const book = new Book({
      title,
      slug,
      category,
      tags: tags ? JSON.parse(tags) : [],
      description,
      visibility,
      bookFileUrl: file, // <-- Google Drive link
      thumbnail: thumbnailUrl,
    })

    await book.save()

    return res.status(201).json({
      success: true,
      message: "Book uploaded successfully",
      book,
    })
  } catch (error) {
    console.error("Create book error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}


/* ===============================
   GET ALL BOOKS
================================ */
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   GET SINGLE BOOK
================================ */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   DELETE BOOK
================================ */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    await book.deleteOne();
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
