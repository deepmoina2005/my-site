import Project from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";

/* ===============================
   CREATE NEW PROJECT
================================ */
export const createProject = async (req, res) => {
  try {
    // Destructure text fields from req.body
    const {
      name,
      description,
      skills,
      liveLink,
      codeLink,
      startDate,
      endDate,
      associatedWith,
      isOngoing,
      category,
    } = req.body;

    if (!name || !description || !startDate) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    /* ===============================
       CLOUDINARY MEDIA UPLOAD
    ================================ */
    let mediaUrls = [];
    let coverImageUrl = "";

    if (req.files) {
      // req.files is an object if using multer.fields()
      // Example: { coverImage: [File], media: [File, File, ...] }
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        const uploadResult = await cloudinary.uploader.upload(
          `data:${req.files.coverImage[0].mimetype};base64,${req.files.coverImage[0].buffer.toString(
            "base64"
          )}`,
          { folder: "projects", resource_type: "auto" }
        );
        coverImageUrl = uploadResult.secure_url;
      }

      if (req.files.media && req.files.media.length > 0) {
        for (const file of req.files.media) {
          const uploadResult = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "projects", resource_type: "auto" }
          );
          mediaUrls.push(uploadResult.secure_url);
        }
      }
    }

    /* ===============================
       SAFE SKILLS PARSING
    ================================ */
    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = JSON.parse(skills);
        if (!Array.isArray(skillsArray)) {
          skillsArray = skills.toString().split(",").map(s => s.trim());
        }
      } catch {
        skillsArray = skills.toString().split(",").map(s => s.trim());
      }
    }

    const project = new Project({
      name,
      description,
      skills: skillsArray,
      media: mediaUrls,
      coverImage: coverImageUrl,
      liveLink: liveLink || "",
      codeLink: codeLink || "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      associatedWith: associatedWith || "",
      isOngoing: isOngoing === "true" || isOngoing === true, // FormData sends strings
      category: category || "",
    });

    await project.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};


/* ===============================
   GET ALL PROJECTS
================================ */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   GET SINGLE PROJECT BY ID
================================ */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Get project by ID error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   UPDATE PROJECT
================================ */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    const {
      name,
      description,
      skills,
      liveLink,
      codeLink,
      startDate,
      endDate,
      associatedWith,
      isOngoing,
      category,
    } = req.body

    if (!name || !description || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      })
    }

    /* ===============================
       SAFE SKILLS PARSING
    ================================ */
    let skillsArray = []

    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills
      } else {
        try {
          const parsed = JSON.parse(skills)
          skillsArray = Array.isArray(parsed)
            ? parsed
            : skills.split(",").map(s => s.trim())
        } catch {
          skillsArray = skills.split(",").map(s => s.trim())
        }
      }
    }

    /* ===============================
       UPDATE TEXT FIELDS
    ================================ */
    project.name = name
    project.description = description
    project.skills = skillsArray
    project.liveLink = liveLink || ""
    project.codeLink = codeLink || ""
    project.startDate = new Date(startDate)
    project.associatedWith = associatedWith || ""
    project.isOngoing = isOngoing === "true" || isOngoing === true
    project.category = category || project.category

    // 🔑 IMPORTANT
    project.endDate = project.isOngoing
      ? null
      : endDate
      ? new Date(endDate)
      : null

    /* ===============================
       FILE HANDLING (MULTER SAFE)
    ================================ */
    if (req.files) {
      // ✅ multer.fields()
      if (req.files.coverImage?.length) {
        const file = req.files.coverImage[0]
        const upload = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "projects", resource_type: "auto" }
        )
        project.coverImage = upload.secure_url
      }

      if (req.files.media?.length) {
        const mediaUrls = []

        for (const file of req.files.media) {
          const upload = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "projects", resource_type: "auto" }
          )
          mediaUrls.push(upload.secure_url)
        }

        project.media = mediaUrls
      }

      // ✅ multer.array("media")
      if (Array.isArray(req.files)) {
        const mediaUrls = []

        for (const file of req.files) {
          const upload = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "projects", resource_type: "auto" }
          )
          mediaUrls.push(upload.secure_url)
        }

        if (mediaUrls.length) project.media = mediaUrls
      }
    }

    await project.save()

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    })
  } catch (error) {
    console.error("Update project error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    })
  }
}


/* ===============================
   DELETE PROJECT
================================ */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    await project.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully", id });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
