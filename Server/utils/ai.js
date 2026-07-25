import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function to clean markdown fences if Gemini adds ```json ... ```
const cleanJSON = (text) => {
  if (!text) return "";
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const analyzeResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are a strict ATS (Applicant Tracking System) used by top hiring companies like Google, Amazon, and Microsoft.

Analyze the resume below and return ONLY a valid JSON object. No explanation, no markdown, no extra text.

JSON format:
{
  "score": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "ats_issues": [],
  "suggestions": []
}

STRICT RULES:
- "score": integer from 1 to 10 (1 = terrible, 10 = perfect)
- "summary": 2-3 sentence honest recruiter verdict
- "strengths": max 5 items — what makes this resume stand out
- "weaknesses": max 5 items — what will get this resume rejected
- "ats_issues": max 5 items — formatting/keyword problems that ATS bots will flag
- "suggestions": max 5 items — specific actionable fixes the candidate must do
- Be brutally honest like a senior recruiter with 10+ years of experience
- Each array item must be a plain string, not an object

Resume:
"""${resumeText}"""
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return cleanJSON(responseText);
  } catch (error) {
    console.error("Resume analysis error:", error);
    return JSON.stringify({
      score: 5,
      summary: "Could not perform deep analysis due to a service issue.",
      strengths: [],
      weaknesses: [],
      ats_issues: [],
      suggestions: ["Try re-uploading your resume file."]
    });
  }
};

export const extractSkillsFromResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are a resume parsing AI.

Extract ONLY technical skills from the resume.

Return ONLY JSON:
{
  "skills": []
}

Rules:
- Only skills (tech, tools, frameworks, languages)

Resume:
"""${resumeText}"""
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return cleanJSON(responseText);
  } catch (error) {
    console.error("Extract skills error:", error);
    return JSON.stringify({ skills: [] });
  }
};

export const getJobRecommendation = async (candidateProfile, job) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Give response in JSON format only.

{
  "reason": "why this job matches",
  "missingSkills": ["skill1", "skill2"],
  "improvementTips": ["tip1", "tip2"]
}

Candidate profile:
${candidateProfile}

Job Title:
${job.title}

Required Skills:
${job.requiredSkills ? job.requiredSkills.join(", ") : job.tags || ""}
`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = completion?.choices?.[0]?.message?.content;
    return cleanJSON(content);
  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    return null;
  }
};

export const getUserRoleFromAI = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
Analyze this resume and return only the single most suitable job role.

Rules:
- Return only 2–4 words
- No punctuation
- No explanation

Examples:
Frontend Developer
Backend Developer
Full Stack Developer
Data Analyst

Resume:
${resumeText}
`);

    return result.response.text().trim();
  } catch (error) {
    console.error("Role detection failed:", error.message);
    return "Developer";
  }
};