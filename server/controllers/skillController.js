import Skill from "../models/skillModel.js";
import { cloudinary } from "../configs/cloudinary.js";

/* ===============================
   CREATE SKILL
================================ */
export const createSkill = async (req, res) => {
  try {
    const { name, description, category, level, link, tags } = req.body;

    if (!name || !category || !level) {
      return res.status(400).json({
        success: false,
        message: "Name, category and level are required",
      });
    }

    /* ---------- ICON UPLOAD ---------- */
    let iconUrl = "";
    if (req.files?.icon) {
      const iconFile = req.files.icon[0];
      const base64Data = iconFile.buffer.toString("base64");

      const uploadResult = await cloudinary.uploader.upload(
        `data:${iconFile.mimetype};base64,${base64Data}`,
        {
          folder: "skills/icons",
          resource_type: "image",
        }
      );

      iconUrl = uploadResult.secure_url;
    }

    /* ---------- SAVE SKILL ---------- */
    const skill = new Skill({
      name,
      description,
      category,
      level,
      link,
      tags: tags ? JSON.parse(tags) : [],
      icon: iconUrl,
    });

    await skill.save();

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   GET ALL SKILLS
================================ */
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   GET SINGLE SKILL
================================ */
export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({ success: true, skill });
  } catch (error) {
    console.error("Get skill error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   DELETE SKILL
================================ */
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   UPDATE SKILL LEVEL
================================ */
export const updateSkillLevel = async (req, res) => {
  try {
    const { level } = req.body
    const skillId = req.params.id

    if (!level) {
      return res.status(400).json({
        success: false,
        message: "Level is required",
      })
    }

    // Find skill by ID
    const skill = await Skill.findById(skillId)
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      })
    }

    // Update level
    skill.level = level
    await skill.save()

    res.status(200).json({
      success: true,
      message: `Skill level updated to ${level}`,
      skill,
    })
  } catch (error) {
    console.error("Update skill level error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}
