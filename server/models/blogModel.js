import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
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
    coverImage: {
      type: String, // store file path or URL
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;