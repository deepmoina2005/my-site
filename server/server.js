import express from "express";
import "dotenv/config"; // Ensure environment variables are loaded
import connectDB from "./configs/mongodb.js";
import cors from "cors";
import adminRouter from "./routes/adminRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import blogRouter from "./routes/blogRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import notesRouter from "./routes/noteRoutes.js";
import bookRouter from "./routes/bookRoute.js";
import productRouter from "./routes/productRoutes.js";
import skillRouter from "./routes/skillRoute.js";
import experienceRouter from "./routes/experienceRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import certificateRouter from "./routes/certificateRoutes.js";
import educationRouter from "./routes/educationRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import settingsRouter from "./routes/settingsRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
connectCloudinary();
// CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173", // admin
    "https://my-site-eu3d.vercel.app", // admin
    "http://localhost:5174", // public site
    "https://my-site-eight-gules.vercel.app", // public site
  ],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// API Endpoints
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/admin", adminRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/projects", projectRouter);
app.use("/api/notes", notesRouter);
app.use("/api/books", bookRouter);
app.use("/api/products", productRouter);
app.use("/api/skills", skillRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/certificates", certificateRouter);
app.use("/api/educations", educationRouter);
app.use("/api/services", serviceRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/settings", settingsRouter);

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));