import resumeModel from "../models/resume.model.js";
import { getJobRecommendation, getUserRoleFromAI } from "../utils/ai.js";
import fetch from "node-fetch";

const normalize = (skill) => skill.toLowerCase().trim();

const cleanAIResponse = (text) => {
  if (!text) return null;

  if (typeof text !== "string") {
    text = JSON.stringify(text);
  }

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const matchJobsForUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    //  RESUME FETCH
    const resume = await resumeModel.findOne({ userId });
    if (!resume) {
      return res.status(404).json({
        message: "Resume not found for this user",
      });
    }

    const resumeSkills = (resume.skills || []).map(normalize);
    const aiScore = resume.aiResult?.score || 0;

    // JOB FETCH
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
    const data = await response.json();
    const jobs = data.data;

    // ROLE DETECTION
    const userRoleRaw =
      (await getUserRoleFromAI(resume.extractedText)) || "developer";

    const userRole = userRoleRaw
      ?.toLowerCase()
      .replace(/[^a-z ]/g, "")
      .trim();

    console.log("Detected Role:", userRole);

    const roleWords = userRole.split(" ");
    const candidateProfile = `
Detected role: ${userRole}
Skills: ${resumeSkills.join(", ")}
ATS summary: ${resume.aiResult?.summary || ""}
`;

    const filteredJobs = jobs.filter((job) => {
      const text = (job.title + " " + job.description).toLowerCase();
      return roleWords.some((word) => text.includes(word));
    });

    // LIMIT JOBS (PERFORMANCE)
    const jobsToProcess =
      filteredJobs.length > 0 ? filteredJobs.slice(0, 15) : jobs.slice(0, 15);

    // PROCESS JOBS
    const results = await Promise.all(
      jobsToProcess.map(async (job, index) => {
        const jobText = (job.title + " " + job.description).toLowerCase();

        //SKILL MATCHING (MAIN LOGIC)
        const matchedSkills = resumeSkills.filter((skill) =>
          jobText.includes(skill),
        );

        const matchScore =
          resumeSkills.length > 0
            ? (matchedSkills.length / resumeSkills.length) * 100
            : 0;

        if (matchedSkills.length === 0 && index > 5) {
          return null;
        }

        // FINAL SCORE
        const normalizedAiScore = (aiScore / 10) * 100;
        const finalScore = Math.round(
          matchScore * 0.8 + normalizedAiScore * 0.2,
        );

        let aiData = {
          reason: "",
          missingSkills: [],
          improvementTips: [],
        };

        if (index < 2) {
          try {
            const rawAI = await getJobRecommendation(candidateProfile, job);

            if (!rawAI) {
              aiData.reason = "AI not responding";
            } else {
              const cleaned = cleanAIResponse(rawAI);

              try {
                aiData = JSON.parse(cleaned);
              } catch {
                console.log("INVALID JSON FROM AI:", cleaned);
                aiData.reason = "Invalid AI response";
              }
            }
          } catch (err) {
            console.log("AI ERROR:", err.message);
          }
        } else {
          aiData.reason = "Basic match (AI skipped)";
        }

        return {
          title: job.title,
          company: job.company_name,
          url: job.url,
          matchedSkills,
          score: finalScore,
          reason: aiData.reason,
          missingSkills: aiData.missingSkills || [],
          improvementTips: aiData.improvementTips || [],
        };
      }),
    );

    const finalResults = results.filter(Boolean);

    finalResults.sort((a, b) => b.score - a.score);

    res.status(200).json({
      message: "Jobs matched successfully",
      detectedRole: userRole,
      data: finalResults,
    });
  } catch (error) {
    console.log("MATCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
