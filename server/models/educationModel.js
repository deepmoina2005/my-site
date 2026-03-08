import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true }, degree: { type: String, required: true }, startDate: { type: Date }, endDate: { type: Date }, description: { type: String }
  },
  { timestamps: true }
);

const EducationModel = mongoose.models.Education || mongoose.model("Education", EducationSchema);

export default EducationModel;
