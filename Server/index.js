import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db.js";
import resumeRoutes from "./routes/resume.route.js";
import jobRoutes from "./routes/job.route.js";
import authRoutes from "./routes/auth.route.js";
import savedJobRoute from "./routes/savedJob.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", savedJobRoute);

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer API is running");
});

app.use(errorHandler);

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
