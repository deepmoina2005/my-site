import EducationModel from "../models/educationModel.js";
import { cloudinary } from "../configs/cloudinary.js";

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
    const { institution, degree, fieldOfStudy, startDate, endDate, grade, activities, description, skills, visibility } = req.body;

    let logoUrl = "";
    if (req.files?.logo) {
      const logoFile = req.files.logo[0];
      const base64Data = logoFile.buffer.toString("base64");
      const uploadResult = await cloudinary.uploader.upload(
        `data:${logoFile.mimetype};base64,${base64Data}`,
        { folder: "education/logos", resource_type: "image" }
      );
      logoUrl = uploadResult.secure_url;
    }

    const newEntity = new EducationModel({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      activities,
      description,
      skills: skills ? JSON.parse(skills) : [],
      logo: logoUrl,
      visibility
    });

    await newEntity.save();
    res.status(201).json({ success: true, message: "Created", entity: newEntity });
  } catch (error) {
    console.error("Create education error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const entity = await EducationModel.findById(req.params.id);
    if (!entity) return res.status(404).json({ success: false, message: "Not found" });

    const { institution, degree, fieldOfStudy, startDate, endDate, grade, activities, description, skills, visibility } = req.body;

    let logoUrl = entity.logo;
    if (req.files?.logo) {
      const logoFile = req.files.logo[0];
      const base64Data = logoFile.buffer.toString("base64");
      const uploadResult = await cloudinary.uploader.upload(
        `data:${logoFile.mimetype};base64,${base64Data}`,
        { folder: "education/logos", resource_type: "image" }
      );
      logoUrl = uploadResult.secure_url;
    }

    entity.institution = institution || entity.institution;
    entity.degree = degree || entity.degree;
    entity.fieldOfStudy = fieldOfStudy || entity.fieldOfStudy;
    entity.startDate = startDate || entity.startDate;
    entity.endDate = endDate || entity.endDate;
    entity.grade = grade || entity.grade;
    entity.activities = activities || entity.activities;
    entity.description = description || entity.description;
    entity.skills = skills ? JSON.parse(skills) : entity.skills;
    entity.logo = logoUrl;
    entity.visibility = visibility || entity.visibility;

    await entity.save();
    res.status(200).json({ success: true, message: "Updated", entity });
  } catch (error) {
    console.error("Update education error:", error);
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
