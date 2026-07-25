import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required:true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter"], // Sirf in dono me se ek role hoga
      default: "candidate",
    },
  },
  { timestamps: true },
);
export default mongoose.model("User", userSchema);