import ServiceModel from "../models/serviceModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const entity = await ServiceModel.findById(req.params.id);
    if (!entity) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, entity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      category,
      status,
      technologies,
      tags,
      features,
      pricing,
      links,
    } = req.body;

    let iconUrl = "";
    let imageUrl = "";

    if (req.files) {
      if (req.files.icon?.length > 0) {
        const file = req.files.icon[0];
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "services", resource_type: "auto" }
        );
        iconUrl = uploadResult.secure_url;
      }
      if (req.files.image?.length > 0) {
        const file = req.files.image[0];
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "services", resource_type: "auto" }
        );
        imageUrl = uploadResult.secure_url;
      }
    }

    const parseField = (field) => {
      if (!field) return undefined;
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch {
        return field;
      }
    };

    const newService = new ServiceModel({
      title,
      shortDescription,
      fullDescription,
      category,
      status,
      icon: iconUrl,
      image: imageUrl,
      technologies: parseField(technologies),
      tags: parseField(tags),
      features: parseField(features),
      pricing: parseField(pricing),
      links: parseField(links),
    });

    await newService.save();
    res.status(201).json({ success: true, message: "Created", entity: newService });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findById(id);
    if (!service) return res.status(404).json({ success: false, message: "Not found" });

    const {
      title,
      shortDescription,
      fullDescription,
      category,
      status,
      technologies,
      tags,
      features,
      pricing,
      links,
    } = req.body;

    if (req.files) {
      if (req.files.icon?.length > 0) {
        const file = req.files.icon[0];
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "services", resource_type: "auto" }
        );
        service.icon = uploadResult.secure_url;
      }
      if (req.files.image?.length > 0) {
        const file = req.files.image[0];
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "services", resource_type: "auto" }
        );
        service.image = uploadResult.secure_url;
      }
    }

    const parseField = (field) => {
      if (!field) return undefined;
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch {
        return field;
      }
    };

    service.title = title || service.title;
    service.shortDescription = shortDescription || service.shortDescription;
    service.fullDescription = fullDescription || service.fullDescription;
    service.category = category || service.category;
    service.status = status || service.status;
    service.technologies = parseField(technologies) || service.technologies;
    service.tags = parseField(tags) || service.tags;
    service.features = parseField(features) || service.features;
    service.pricing = parseField(pricing) || service.pricing;
    service.links = parseField(links) || service.links;

    await service.save();
    res.status(200).json({ success: true, message: "Updated", entity: service });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await ServiceModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
