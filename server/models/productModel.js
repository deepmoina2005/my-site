import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String, // can be a URL or tool/site name
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String, // store Cloudinary image URL
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
