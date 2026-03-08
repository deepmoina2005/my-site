import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Only one settings doc will ever exist (singleton pattern)
    general: {
      siteName: { type: String, default: "My Portfolio" },
      siteTagline: { type: String, default: "" },
      siteDescription: { type: String, default: "" },
      adminEmail: { type: String, default: "" },
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      metaKeywords: { type: String, default: "" },
      ogImageUrl: { type: String, default: "" },
      googleAnalyticsId: { type: String, default: "" },
    },
    social: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    contact: {
      contactEmail: { type: String, default: "" },
      phone: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      address: { type: String, default: "" },
      mapEmbedLink: { type: String, default: "" },
    },
    homepage: {
      heroTitle: { type: String, default: "" },
      heroSubtitle: { type: String, default: "" },
      heroDescription: { type: String, default: "" },
      heroImageUrl: { type: String, default: "" },
      resumeUrl: { type: String, default: "" },
      ctaText: { type: String, default: "Hire Me" },
      ctaLink: { type: String, default: "/contact" },
    },
    theme: {
      primaryColor: { type: String, default: "#7c3aed" },
      darkMode: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
export default Settings;
