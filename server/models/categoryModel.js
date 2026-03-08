import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    module: { 
      type: String, 
      required: true, 
      enum: ["blog", "project", "book", "note", "service", "product", "skill"] 
    }
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
