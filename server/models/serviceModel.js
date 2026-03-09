import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String },
    fullDescription: { type: String },
    category: { type: String },
    status: { type: String, enum: ["Active", "Draft"], default: "Active" },
    image: { type: String },
    technologies: [{ type: String }],
    tags: [{ type: String }],
    features: [
      {
        title: { type: String },
        description: { type: String }
      }
    ],
    links: {
      demo: { type: String },
      github: { type: String },
      documentation: { type: String }
    }
  },
  { timestamps: true }
);

const ServiceModel = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default ServiceModel;