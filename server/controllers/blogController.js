import Blog from "../models/blogModel.js";
import { v2 as cloudinary } from "cloudinary";

/* ===============================
   CREATE NEW BLOG
================================ */
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      tags,
      isPublished,
      isFeatured,
      content,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    // Check duplicate slug
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res
        .status(400)
        .json({ success: false, message: "Slug already exists" });
    }

    /* ===============================
       CLOUDINARY IMAGE UPLOAD
    ================================ */
    let coverImage = "";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "blogs",
          resource_type: "image",
        }
      );

      coverImage = uploadResult.secure_url;
    }

    const blog = new Blog({
      title,
      slug,
      category,
      tags: tags ? JSON.parse(tags) : [],
      coverImage,
      isPublished: Boolean(isPublished),
      isFeatured: Boolean(isFeatured),
      content,
    });

    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};


/* ===============================
   GET ALL BLOGS
================================ */
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Get blogs error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   GET SINGLE BLOG BY SLUG
================================ */
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Get blog by slug error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   UPDATE BLOG
================================ */
export const updateBlog = async (req, res) => {
  try {
    const { slug } = req.params
    const blog = await Blog.findOne({ slug })
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" })

    const {
      title,
      category,
      tags,
      isPublished,
      isFeatured,
      content,
    } = req.body

    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: "Required fields missing" })
    }

    // Update fields
    blog.title = title
    blog.slug = req.body.slug || blog.slug
    blog.category = category
    blog.tags = tags ? JSON.parse(tags) : []
    blog.isPublished = Boolean(isPublished)
    blog.isFeatured = Boolean(isFeatured)
    blog.content = content

    // Update cover image if provided
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "blogs", resource_type: "image" }
      )
      blog.coverImage = uploadResult.secure_url
    }

    await blog.save()

    return res.status(200).json({ success: true, blog })
  } catch (error) {
    console.error("Update blog error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}


/* ===============================
   DELETE BLOG
================================ */
export const deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await blog.deleteOne();

    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};