import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String, // from dynamic categories
    },
    skills: {
      type: [String],
      default: [],
    },
    media: {
      type: [String], // URLs or file paths of images, videos, documents
      default: [],
    },
    coverImage: {
      type: String, // main cover image URL or file path
    },
    liveLink: {
      type: String, // optional live demo URL
    },
    codeLink: {
      type: String, // optional GitHub or repo URL
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date, // can be null if ongoing
    },
    associatedWith: {
      type: String, // e.g., company, personal, or course
    },
    isOngoing: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;