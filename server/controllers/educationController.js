import EducationModel from "../models/EducationModel.js";

export const getAllEducationS = async (req, res) => {
  try {
    const educations = await EducationModel.find();
    res.status(200).json({ success: true, educations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEducationById = async (req, res) => {
  try {
    const entity = await EducationModel.findById(req.params.id);
    if (!entity) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, entity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEducation = async (req, res) => {
  try {
    const newEntity = new EducationModel(req.body);
    await newEntity.save();
    res.status(201).json({ success: true, message: "Created", entity: newEntity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const updated = await EducationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Updated", entity: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    await EducationModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
