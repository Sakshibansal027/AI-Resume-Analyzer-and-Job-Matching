import Job from "../models/job.model.js";
export const addjob = async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;
    if (!title || !requiredSkills) {
      return res.status(400).json({
        message: "Title and requiredSkills are required",
      });
    }
    const job = await Job.create({
      title,
      description,
      requiredSkills,
    });
    res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating job",
    });
  }
};
