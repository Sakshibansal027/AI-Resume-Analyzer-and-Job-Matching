import express from"express"
import { matchJobsForUser } from "../controllers/match.controller.js"
const router=express.Router();
router.get("/:userId",matchJobsForUser);
export default router;