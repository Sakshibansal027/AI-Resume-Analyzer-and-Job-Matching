import express from 'express';
import { addjob } from '../controllers/job.controller.js'
import { matchJobsForUser } from "../controllers/match.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.get("/match", protect, matchJobsForUser);
router.post('/', addjob)
export default router