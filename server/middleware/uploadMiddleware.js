import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  cb(null, true); // allow all (file + image)
};

export const upload = multer({
  storage,
  fileFilter,
});
