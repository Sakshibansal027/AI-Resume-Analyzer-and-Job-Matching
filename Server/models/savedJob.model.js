import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobTitle: String,
  company: String,
  applyLink: String,
});

export default mongoose.model("SavedJob", savedJobSchema);