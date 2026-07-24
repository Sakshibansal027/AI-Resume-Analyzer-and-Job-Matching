import mongoose from "mongoose";
const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
    missingSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);
export default mongoose.model("Match", matchSchema);
