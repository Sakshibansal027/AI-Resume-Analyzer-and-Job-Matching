import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
    },
    description: {
      type: String,
    },
    requiredSkills: {
      type: [String],
      required: true,
    },
    experienceLevel: {
      type: String,
    },
    location: {
      type: String,
    },
    salary: {
      type: String,
    },
    jobType: {
      type: String,
    },
      postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);
export default mongoose.model("Job", jobSchema);
