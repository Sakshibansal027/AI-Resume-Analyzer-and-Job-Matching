import { analyzeResume, extractSkillsFromResume } from "../utils/ai.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParseLib = require("pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;

import resumeModel from "../models/resume.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";


const cleanAIResponse = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};


export const uploadResume = async (req, res) => {
  try {
    // ✅ 1. File check
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const file = req.file;

    // ✅ 2. Extract text from PDF
    const pdfData = await pdfParse(file.buffer);
    const text = pdfData.text;

    
    let cloudFileUrl = "";

    try {
      const cloudResult = await uploadBufferToCloudinary(file.buffer, {
        public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
      });
      cloudFileUrl = cloudResult.secure_url;
    } catch (err) {
      console.log("❌ Cloudinary upload failed:", err.message);

      return res.status(500).json({
        message: "Failed to upload resume file. Please try again.",
      });
    }

    
    let parsedAI = {};

    try {
      const rawAI = await analyzeResume(text);
      const cleanedAI = cleanAIResponse(rawAI);
      parsedAI = JSON.parse(cleanedAI);
    } catch (err) {
      console.log("❌ AI Analysis Failed:", err.message);

      // ✅ fallback (so UI never crashes)
      parsedAI = {
        score: 0,
        summary: "AI analysis failed. Please try again.",
        strengths: [],
        weaknesses: [],
        ats_issues: [],
        suggestions: [],
      };
    }

    
    let extractedSkills = [];

    try {
      const rawSkills = await extractSkillsFromResume(text);
      const cleanedSkills = cleanAIResponse(rawSkills);
      const parsedSkills = JSON.parse(cleanedSkills);
      extractedSkills = parsedSkills.skills || [];
    } catch (err) {
      console.log("❌ Skill extraction failed:", err.message);

      // ✅ fallback skill detection
      const skillsList = ["react", "node", "mongodb", "express", "javascript"];
      extractedSkills = skillsList.filter((skill) =>
        text.toLowerCase().includes(skill)
      );
    }

  
    const userId = req.user.userId;

    let resume = await resumeModel.findOne({ userId });

    if (resume) {
      resume.file = cloudFileUrl;
      resume.extractedText = text;
      resume.skills = extractedSkills;
      resume.aiResult = parsedAI;
      await resume.save();
    } else {
      resume = await resumeModel.create({
        userId,
        file: cloudFileUrl,
        extractedText: text,
        skills: extractedSkills,
        aiResult: parsedAI,
      });
    }

    
    res.status(200).json({
      message: "Resume processed successfully",
      data: {
        ...resume.toObject(),
        aiResult: resume.aiResult || {
          score: 0,
          summary: "No analysis available",
        },
      },
    });
  } catch (error) {
    console.log("❌ SERVER ERROR:", error);

    res.status(500).json({
      message: "Error processing resume",
    });
  }
};


export const getMyResume = async (req, res) => {
  try {
    const resume = await resumeModel
      .findOne({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select("skills aiResult updatedAt");

    if (!resume) {
      return res.status(404).json({
        message: "No resume found. Please upload one first.",
      });
    }

    res.status(200).json({
      data: resume,
    });
  } catch (error) {
    console.log("❌ FETCH ERROR:", error);

    res.status(500).json({
      message: "Could not fetch resume analysis.",
    });
  }
};