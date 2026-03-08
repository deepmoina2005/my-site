import express from "express";
import multer from "multer";
import { getAllServices as getAll, getServiceById as getById, createService as create, updateService as update, deleteService as remove } from "../controllers/serviceController.js";

const router = express.Router();

// MULTER CONFIG
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, jpeg, png, svg) allowed"), false);
  }
};
const upload = multer({ storage, fileFilter });

router.get("/", getAll);
router.get("/:id", getById);

router.post("/", upload.fields([
  { name: "icon", maxCount: 1 },
  { name: "image", maxCount: 1 }
]), create);

router.put("/:id", upload.fields([
  { name: "icon", maxCount: 1 },
  { name: "image", maxCount: 1 }
]), update);

router.delete("/:id", remove);

export default router;
