import fs from "fs";
import { analyzeResume, extractSkillsFromResume } from "../utils/ai.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParseLib = require("pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;

import resumeModel from "../models/resume.model.js";

const cleanAIResponse = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const file = req.file;
    const filepath = file.path;

    const dataBuffer = fs.readFileSync(filepath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    let parsedAI = {};

    try {
      const rawAI = await analyzeResume(text);

      const cleanedAI = cleanAIResponse(rawAI);

      parsedAI = JSON.parse(cleanedAI);
    } catch (err) {
      console.log("AI Analysis Failed:", err);

      parsedAI = {
        score: 0,
        summary: "AI failed",
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
      console.log("Skill extraction failed:", err);

      const skillsList = ["react", "node", "mongodb", "express", "javascript"];
      extractedSkills = skillsList.filter((skill) =>
        text.toLowerCase().includes(skill),
      );
    }

    const userId = req.user.userId;

    let resume = await resumeModel.findOne({ userId });

    if (resume) {
      resume.file = filepath;
      resume.extractedText = text;
      resume.skills = extractedSkills;
      resume.aiResult = parsedAI;

      await resume.save();
    } else {
      resume = await resumeModel.create({
        userId,
        file: filepath,
        extractedText: text,
        skills: extractedSkills,
        aiResult: parsedAI,
      });
    }

    res.status(200).json({
      message: "Resume processed successfully",
      data: resume,
    });
  } catch (error) {
    console.log(error);

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
    res.status(500).json({
      message: "Could not fetch resume analysis.",
    });
  }
};
