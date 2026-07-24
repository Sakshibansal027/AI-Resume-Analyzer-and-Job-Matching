import express from "express";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadResume,getMyResume } from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/me", protect, getMyResume);
export default router;
