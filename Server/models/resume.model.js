import mongoose from "mongoose";
const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    file: {
      type: String,
      required: false,
    },
    extractedText: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    aiResult: {
      score: Number,
      summary: String,
      strengths: [String],
      weaknesses: [String],
      ats_issues: [String],
      suggestions: [String],
    },
  },
  { timestamps: true },
);
export default mongoose.model("Resume", resumeSchema);
