import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Blog from "../models/blogModel.js";
import Project from "../models/projectModel.js";
import Skill from "../models/skillModel.js";
import Product from "../models/productModel.js";
import Book from "../models/bookModel.js";
import Note from "../models/noteModel.js";
import Service from "../models/serviceModel.js";
import Certificate from "../models/certificateModel.js";
import Education from "../models/educationModel.js";
import Experience from "../models/experienceModel.js";
import Contact from "../models/contactModel.js";
import Category from "../models/categoryModel.js";

/* ===============================
   CREATE INITIAL ADMIN (ONCE)
================================ */
const createAdmin = async () => {
  try {
    const adminId = process.env.ADMIN_ID;
    const password = process.env.ADMIN_PASSWORD;

    if (!adminId || !password) {
      console.log("Admin credentials missing in .env");
      return;
    }

    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      adminId,
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin created successfully");
  } catch (error) {
    console.error("Admin creation error:", error.message);
  }
};

createAdmin();

/* ===============================
   ADMIN LOGIN
================================ */
export const adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin Id and password are required",
      });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   ADMIN LOGOUT
================================ */
export const adminLogout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};


/* ===============================
   CHANGE PASSWORD
================================ */
export const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.adminId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating password",
    });
  }
};

/* ===============================
   CHANGE ADMIN ID
================================ */
export const changeAdminID = async (req, res) => {
  try {
    const { password, newAdminId } = req.body;
    const adminId = req.adminId;

    if (!password || !newAdminId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }

    admin.adminId = newAdminId;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin Id updated successfully",
    });
  } catch (error) {
    console.error("Admin Id change error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating Admin Id",
    });
  }
};

/* ===============================
   GET DASHBOARD STATS
================================ */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      blogCount,
      projectCount,
      skillCount,
      productCount,
      bookCount,
      noteCount,
      serviceCount,
      certificateCount,
      educationCount,
      experienceCount,
      contactCount,
      categoryCount
    ] = await Promise.all([
      Blog.countDocuments(),
      Project.countDocuments(),
      Skill.countDocuments(),
      Product.countDocuments(),
      Book.countDocuments(),
      Note.countDocuments(),
      Service.countDocuments(),
      Certificate.countDocuments(),
      Education.countDocuments(),
      Experience.countDocuments(),
      Contact.countDocuments(),
      Category.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      stats: {
        blogs: blogCount,
        projects: projectCount,
        skills: skillCount,
        products: productCount,
        books: bookCount,
        notes: noteCount,
        services: serviceCount,
        certificates: certificateCount,
        educations: educationCount,
        experiences: experienceCount,
        contacts: contactCount,
        categories: categoryCount
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats"
    });
  }
};