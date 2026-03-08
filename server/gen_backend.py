import os
from pathlib import Path

SERVER_DIR = Path("v:/My Website/server")

missing_entities = ["category", "certificate", "education", "service"]

# Models
model_template = """import mongoose from "mongoose";

const ENTITY_NAMESchema = new mongoose.Schema(
  {
    FIELDS
  },
  { timestamps: true }
);

const ENTITY_NAMEModel = mongoose.model("ENTITY_NAME", ENTITY_NAMESchema);

export default ENTITY_NAMEModel;
"""

entity_fields = {
    "category": "name: { type: String, required: true }, description: { type: String }",
    "certificate": "title: { type: String, required: true }, issuer: { type: String, required: true }, image: { type: String }, link: { type: String }",
    "education": "institution: { type: String, required: true }, degree: { type: String, required: true }, startDate: { type: Date }, endDate: { type: Date }, description: { type: String }",
    "service": "name: { type: String, required: true }, description: { type: String }, features: [{ type: String }]"
}

for entity in missing_entities:
    name_cap = entity.capitalize()
    model_content = model_template.replace("ENTITY_NAME", name_cap).replace("FIELDS", entity_fields[entity])
    with open(SERVER_DIR / "models" / f"{entity}Model.js", "w") as f:
        f.write(model_content)

# Controllers
controller_template = """import ENTITY_NAMEModel from "../models/ENTITY_NAMEModel.js";

export const getAllENTITY_NAMES = async (req, res) => {
  try {
    const PLURAL_NAME = await ENTITY_NAMEModel.find();
    res.status(200).json({ success: true, PLURAL_NAME });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getENTITY_NAMEById = async (req, res) => {
  try {
    const entity = await ENTITY_NAMEModel.findById(req.params.id);
    if (!entity) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, entity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createENTITY_NAME = async (req, res) => {
  try {
    const newEntity = new ENTITY_NAMEModel(req.body);
    await newEntity.save();
    res.status(201).json({ success: true, message: "Created", entity: newEntity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateENTITY_NAME = async (req, res) => {
  try {
    const updated = await ENTITY_NAMEModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Updated", entity: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteENTITY_NAME = async (req, res) => {
  try {
    await ENTITY_NAMEModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
"""

for entity in missing_entities:
    name_cap = entity.capitalize()
    plural = f"{entity}s"
    controller_content = controller_template.replace("ENTITY_NAME", name_cap).replace("PLURAL_NAME", plural)
    with open(SERVER_DIR / "controllers" / f"{entity}Controller.js", "w") as f:
        f.write(controller_content)

# Routes
route_template = """import express from "express";
import { getAllENTITY_NAMES, getENTITY_NAMEById, createENTITY_NAME, updateENTITY_NAME, deleteENTITY_NAME } from "../controllers/ENTITY_NAMEController.js";

const router = express.Router();

router.get("/", getAllENTITY_NAMES);
router.get("/:id", getENTITY_NAMEById);
router.post("/", createENTITY_NAME);
router.put("/:id", updateENTITY_NAME);
router.delete("/:id", deleteENTITY_NAME);

export default router;
"""

for entity in missing_entities:
    name_cap = entity.capitalize()
    route_content = route_template.replace("ENTITY_NAME", name_cap)
    with open(SERVER_DIR / "routes" / f"{entity}Routes.js", "w") as f:
        f.write(route_content)

print("Generated backend files.")
