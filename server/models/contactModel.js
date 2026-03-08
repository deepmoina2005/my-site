import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["read", "unread"], default: "unread" }
  },
  { timestamps: true }
);

const ContactModel = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default ContactModel;
