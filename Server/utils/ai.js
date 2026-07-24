import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const analyzeResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
- "ats_issues": max 5 items — formatting/keyword problems that ATS bots will flag (e.g., missing keywords, tables, images, non-standard fonts)
- "suggestions": max 5 items — specific actionable fixes the candidate must do
- Be brutally honest like a senior recruiter with 10+ years of experience
- Each array item must be a plain string, not an object
- Return ONLY the JSON. Any text outside JSON will break the system.

Resume:
"""${resumeText}"""
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.log(error);
    return "Error analyzing resume";
  }
};

export const extractSkillsFromResume = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a resume parsing AI.

Extract ONLY technical skills from the resume.

Return ONLY JSON:
{
  "skills": []
}

Rules:
- No explanation
- No extra text
- Only skills (tech, tools, frameworks, languages)


Resume:
"""${resumeText}"""
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getJobRecommendation = async (candidateProfile, job) => {
  try {
    const skills = job.requiredSkills?.join(", ") || "";

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
${job.tags}
`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
    });

    const content = completion?.choices?.[0]?.message?.content;

    console.log("AI RAW:", content);

    return content;
  } catch (error) {
    console.log("GROQ ERROR:", error.message);
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
    console.log("Role detection failed:", error.message);
    return "developer";
  }
};
