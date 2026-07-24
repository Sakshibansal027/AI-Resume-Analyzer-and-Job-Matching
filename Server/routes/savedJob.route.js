import express from "express";
import {
  saveJob,
  getSavedJobs,
  deleteSavedJob,
} from "../controllers/savedJob.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/save", protect, saveJob);
router.get("/saved", protect, getSavedJobs);
router.delete("/unsave/:jobId", protect, deleteSavedJob);

export default router;