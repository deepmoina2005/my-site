import CategoryModel from "../models/categoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const { module } = req.query;
    const filter = module ? { module } : {};
    const categories = await CategoryModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, module } = req.body;
    if (!name || !module) {
      return res.status(400).json({ success: false, message: "Name and module are required" });
    }
    const newCategory = new CategoryModel({ name, description, module });
    await newCategory.save();
    res.status(201).json({ success: true, message: "Category created", category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, message: "Category updated", category: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
