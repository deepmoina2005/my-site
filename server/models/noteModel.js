import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
    },

    semester: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String, // image URL
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
export default Note;