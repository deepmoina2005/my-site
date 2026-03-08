import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      default: "Onsite",
    },

    location: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    isOngoing: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
    },

    logo: {
      type: String, // Cloudinary URL
      trim: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

const Experience = mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
export default Experience;