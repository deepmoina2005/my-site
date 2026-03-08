import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    issueMonth: { type: String },
    issueYear: { type: Number },
    expirationMonth: { type: String },
    expirationYear: { type: Number },
    credentialId: { type: String },
    link: { type: String }, // Credential URL
    image: { type: String }, // Main certificate image
    skills: [{ type: String }],
    media: [{ type: String }] // Additional media links
  },
  { timestamps: true }
);


const CertificateModel = mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);

export default CertificateModel;
