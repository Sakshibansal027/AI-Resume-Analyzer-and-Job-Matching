import express from 'express';
import { 
  addjob, 
  getMyPostedJobs, 
  updateJob, 
  deleteJob 
} from '../controllers/job.controller.js';
import { matchJobsForUser, getMatchHistory } from "../controllers/match.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Match routes
router.get("/match", protect, matchJobsForUser);
router.get("/matches/history", protect, getMatchHistory);

// Recruiter Job Management routes
router.get("/my-jobs", protect, getMyPostedJobs);
router.post('/', protect, addjob);
router.put('/update/:jobId', protect, updateJob);   // Edit job route
router.delete('/delete/:jobId', protect, deleteJob); // Delete job route

export default router;