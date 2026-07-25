import express from 'express';
import { addjob } from '../controllers/job.controller.js'
import { matchJobsForUser, getMatchHistory } from "../controllers/match.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.get("/match", protect, matchJobsForUser);
router.get("/matches/history", protect, getMatchHistory);
router.post('/',protect, addjob)
export default router