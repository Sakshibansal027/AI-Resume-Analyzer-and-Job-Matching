import multer from "multer";

//  Use memory storage (no local file saving)
const storage = multer.memoryStorage();

//  Allow only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF resume files are allowed"), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to handle single file upload (field name: 'resume')
export const uploadResume = upload.single("resume");

// (optional) export full upload instance if needed elsewhere
export default upload;