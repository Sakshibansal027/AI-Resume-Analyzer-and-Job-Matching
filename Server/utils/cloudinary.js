import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (buffer, options = {}) => {
  const base64Data = `data:application/pdf;base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64Data, {
    resource_type: "raw",
    folder: "resumes",
    ...options,
  });

  return result;
};

export default cloudinary;