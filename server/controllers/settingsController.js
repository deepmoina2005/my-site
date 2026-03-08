import Settings from "../models/settingsModel.js";
import { v2 as cloudinary } from "cloudinary";

/* ═══════════════════════════════════════════════
   GET SETTINGS  (public)
═══════════════════════════════════════════════ */
export const getSettings = async (req, res) => {
  try {
    // Always return a single settings doc (create defaults if none exists)
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("getSettings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════
   UPDATE SETTINGS  (protected – JSON fields)
═══════════════════════════════════════════════ */
export const updateSettings = async (req, res) => {
  try {
    const { general, seo, social, contact, homepage, theme } = req.body;

    const updateData = {};
    if (general)  updateData.general  = general;
    if (seo)      updateData.seo      = seo;
    if (social)   updateData.social   = social;
    if (contact)  updateData.contact  = contact;
    if (homepage) updateData.homepage = homepage;
    if (theme)    updateData.theme    = theme;

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Settings saved.", settings });
  } catch (error) {
    console.error("updateSettings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════
   UPLOAD FILE  (protected – Cloudinary)
   Query param: ?field=siteLogoUrl | faviconUrl | ogImageUrl | heroImageUrl | resumeUrl
═══════════════════════════════════════════════ */
export const uploadSettingFile = async (req, res) => {
  try {
    const { field } = req.query;
    if (!field) return res.status(400).json({ success: false, message: "field query param required" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const isResume = field === "resumeUrl";
    const resourceType = isResume ? "raw" : "image";
    const folder = "settings";

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder, resource_type: resourceType }
    );

    const url = uploadResult.secure_url;

    // Map field to the nested path
    const fieldMap = {
      siteLogoUrl:  "general.siteLogoUrl",
      faviconUrl:   "general.faviconUrl",
      ogImageUrl:   "seo.ogImageUrl",
      heroImageUrl: "homepage.heroImageUrl",
      resumeUrl:    "homepage.resumeUrl",
    };

    const dbField = fieldMap[field];
    if (!dbField) return res.status(400).json({ success: false, message: "Unknown field" });

    await Settings.findOneAndUpdate({}, { $set: { [dbField]: url } }, { upsert: true });

    res.status(200).json({ success: true, url, field });
  } catch (error) {
    console.error("uploadSettingFile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
