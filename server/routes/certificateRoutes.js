import express from "express";
import multer from "multer";
import { getAllCertificateS, getCertificateById, createCertificate, updateCertificate, deleteCertificate } from "../controllers/certificateController.js";

const router = express.Router();

// MULTER CONFIG
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, jpeg, png) and pdf allowed"), false);
  }
};
const upload = multer({ storage, fileFilter });

router.get("/", getAllCertificateS);
router.get("/:id", getCertificateById);

router.post("/", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "media", maxCount: 10 }
]), createCertificate);

router.put("/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "media", maxCount: 10 }
]), updateCertificate);

router.delete("/:id", deleteCertificate);

export default router;
