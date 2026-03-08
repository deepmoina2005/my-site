import CertificateModel from "../models/certificateModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllCertificateS = async (req, res) => {
  try {
    const certificates = await CertificateModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const entity = await CertificateModel.findById(req.params.id);
    if (!entity) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, entity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const {
      title,
      issuer,
      issueMonth,
      issueYear,
      expirationMonth,
      expirationYear,
      credentialId,
      link,
      skills,
    } = req.body;

    let imageUrl = "";
    let mediaUrls = [];

    if (req.files) {
      if (req.files.image?.length > 0) {
        const file = req.files.image[0];
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "certificates", resource_type: "auto" }
        );
        imageUrl = uploadResult.secure_url;
      }

      if (req.files.media?.length > 0) {
        for (const file of req.files.media) {
          const uploadResult = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "certificates", resource_type: "auto" }
          );
          mediaUrls.push(uploadResult.secure_url);
        }
      }
    }

    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = typeof skills === "string" ? JSON.parse(skills) : skills;
      } catch {
        skillsArray = skills.toString().split(",").map((s) => s.trim());
      }
    }

    const newEntity = new CertificateModel({
      title,
      issuer,
      issueMonth,
      issueYear,
      expirationMonth,
      expirationYear,
      credentialId,
      link,
      image: imageUrl,
      media: mediaUrls,
      skills: Array.isArray(skillsArray) ? skillsArray : [],
    });

    await newEntity.save();
    res.status(201).json({ success: true, message: "Created", entity: newEntity });
  } catch (error) {
    console.error("Create certificate error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      issuer,
      issueMonth,
      issueYear,
      expirationMonth,
      expirationYear,
      credentialId,
      link,
      skills,
    } = req.body;

    const certificate = await CertificateModel.findById(id);
    if (!certificate) return res.status(404).json({ success: false, message: "Not found" });

    if (req.files) {
      if (req.files.image?.length > 0) {
        const file = req.files.image[0];
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "certificates", resource_type: "auto" }
        );
        certificate.image = uploadResult.secure_url;
      }

      if (req.files.media?.length > 0) {
        const mediaUrls = [];
        for (const file of req.files.media) {
          const uploadResult = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "certificates", resource_type: "auto" }
          );
          mediaUrls.push(uploadResult.secure_url);
        }
        certificate.media = mediaUrls;
      }
    }

    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = typeof skills === "string" ? JSON.parse(skills) : skills;
      } catch {
        skillsArray = skills.toString().split(",").map((s) => s.trim());
      }
    }

    certificate.title = title || certificate.title;
    certificate.issuer = issuer || certificate.issuer;
    certificate.issueMonth = issueMonth;
    certificate.issueYear = issueYear;
    certificate.expirationMonth = expirationMonth;
    certificate.expirationYear = expirationYear;
    certificate.credentialId = credentialId;
    certificate.link = link;
    certificate.skills = Array.isArray(skillsArray) ? skillsArray : certificate.skills;

    await certificate.save();
    res.status(200).json({ success: true, message: "Updated", entity: certificate });
  } catch (error) {
    console.error("Update certificate error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    await CertificateModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
