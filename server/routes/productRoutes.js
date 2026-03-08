import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts } from "../controllers/productController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const productRouter = express.Router();

// Create Product
productRouter.post(
  "/create",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  createProduct
);

// Get all products
productRouter.get("/", getProducts);

// Get single product
productRouter.get("/:id", getProductById);

// Delete product
productRouter.delete("/:id", deleteProduct);

export default productRouter;
