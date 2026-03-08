import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
    },

    bookFileUrl: {
      type: String, // URL of uploaded PDF
      required: true,
    },

    thumbnail: {
      type: String, // image URL
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
export default Book;
