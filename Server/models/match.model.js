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
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
    },
    jobUrl: {
      type: String,
    },
     source: {
      type: String,
      enum: ["internal", "external"],
      default: "external",
    },
    matchScore: {
      type: Number,
      required: true,
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Match", matchSchema);