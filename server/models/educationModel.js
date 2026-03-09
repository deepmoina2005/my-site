import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String },
    activities: { type: String },
    description: { type: String },
    skills: { type: [String], default: [] },
    logo: { type: String },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
  },
  { timestamps: true }
);

const EducationModel = mongoose.models.Education || mongoose.model("Education", EducationSchema);

export default EducationModel;
