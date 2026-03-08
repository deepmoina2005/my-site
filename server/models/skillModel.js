import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert", "Completed"],
      required: true,
    },

    link: {
      type: String,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    icon: {
      type: String, // Cloudinary URL
      trim: true,
    },
  },
  { timestamps: true }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);
export default Skill;