import Experience from "../models/experienceModel.js";
import { cloudinary } from "../configs/cloudinary.js";

/* ===============================
   CREATE EXPERIENCE
================================ */
export const createExperience = async (req, res) => {
  try {
    const {
      title,
      company,
      workMode,
      location,
      startDate,
      endDate,
      isOngoing,
      category,
      tags,
      description,
      visibility,
    } = req.body;

    if (!title || !company || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Title, company and start date are required",
      });
    }

    /* ---------- LOGO UPLOAD ---------- */
    let logoUrl = "";
    if (req.files?.logo) {
      const logoFile = req.files.logo[0];
      const base64Data = logoFile.buffer.toString("base64");

      const uploadResult = await cloudinary.uploader.upload(
        `data:${logoFile.mimetype};base64,${base64Data}`,
        {
          folder: "experience/logos",
          resource_type: "image",
        }
      );

      logoUrl = uploadResult.secure_url;
    }

    /* ---------- SAVE EXPERIENCE ---------- */
    const experience = new Experience({
      title,
      company,
      workMode,
      location: workMode === "Remote" ? "Remote" : location,
      startDate,
      endDate: isOngoing === "true" ? null : endDate,
      isOngoing: isOngoing === "true",
      category,
      tags: tags ? JSON.parse(tags) : [],
      description,
      visibility,
      logo: logoUrl,
    });

    await experience.save();

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    console.error("Create experience error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   GET ALL EXPERIENCES
================================ */
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, experiences });
  } catch (error) {
    console.error("Get experiences error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   GET SINGLE EXPERIENCE
================================ */
export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({ success: true, experience });
  } catch (error) {
    console.error("Get experience error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   DELETE EXPERIENCE
================================ */
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    await experience.deleteOne();

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   UPDATE EXPERIENCE
================================ */
export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    Object.assign(experience, req.body);
    await experience.save();

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error("Update experience error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
