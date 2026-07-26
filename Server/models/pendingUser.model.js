import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, // already hashed before saving
  },
  role: {
    type: String,
    enum: ["candidate", "recruiter"],
    default: "candidate",
  },
  verificationToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index — MongoDB auto-deletes this doc once expiresAt passes
  },
});

export default mongoose.model("PendingUser", pendingUserSchema);