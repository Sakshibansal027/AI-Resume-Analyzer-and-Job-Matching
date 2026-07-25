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

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman/Thunder Client, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
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
