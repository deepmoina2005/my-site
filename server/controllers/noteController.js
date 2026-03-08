import { cloudinary } from "../configs/cloudinary.js";
import Note from "../models/noteModel.js";

/* ===============================
   CREATE NOTE
================================ */
export const createNote = async (req, res) => {
  try {
    const {
      title,
      category,
      subject,
      course,
      semester,
      tags,
      description,
      visibility,
      file, // <-- this will be the Google Drive link
    } = req.body;

    if (!title || !category || !subject || !file) {
      return res.status(400).json({
        success: false,
        message: "Title, category, subject & file/link are required",
      });
    }

    /* ========= UPLOAD THUMBNAIL ========= */
    let thumbnailUrl = "";

    if (req.files?.thumbnail) {
      const thumbUpload = await cloudinary.uploader.upload(
        `data:${req.files.thumbnail[0].mimetype};base64,${req.files.thumbnail[0].buffer.toString(
          "base64"
        )}`,
        {
          folder: "notes/thumbnails",
          resource_type: "image",
        }
      );

      thumbnailUrl = thumbUpload.secure_url;
    }

    const note = new Note({
      title,
      category,
      subject,
      course,
      semester,
      tags: tags ? JSON.parse(tags) : [],
      description,
      visibility,
      fileUrl: file, // <-- save Google Drive link directly
      thumbnail: thumbnailUrl,
    });

    await note.save();

    return res.status(201).json({
      success: true,
      message: "Notes saved successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   GET ALL NOTES
================================ */
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   GET SINGLE NOTE
================================ */
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });

    return res.status(200).json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   DELETE NOTE
================================ */
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });

    await note.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
