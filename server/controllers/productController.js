import Product from "../models/productModel.js";
import { cloudinary } from "../configs/cloudinary.js";

/* ===============================
   CREATE PRODUCT
================================ */
export const createProduct = async (req, res) => {
  try {
    const { title, category, subject, tags, description, visibility } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    // ---------- THUMBNAIL UPLOAD ----------
    let thumbnailUrl = "";
    if (req.files?.thumbnail) {
      const thumbFile = req.files.thumbnail[0];
      const base64Data = thumbFile.buffer.toString("base64");
      const uploadThumb = await cloudinary.uploader.upload(
        `data:${thumbFile.mimetype};base64,${base64Data}`,
        { folder: "products/thumbnails", resource_type: "image" }
      );
      thumbnailUrl = uploadThumb.secure_url;
    }

    // ---------- SAVE PRODUCT ----------
    const product = new Product({
      title,
      category,
      subject,
      tags: tags ? JSON.parse(tags) : [],
      description,
      visibility: visibility || "public",
      thumbnail: thumbnailUrl,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   GET ALL PRODUCTS
================================ */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   GET SINGLE PRODUCT
================================ */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   DELETE PRODUCT
================================ */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
