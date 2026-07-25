import Job from "../models/job.model.js";
export const addjob = async (req, res) => {
  try {
    const { title,
      description,
      requiredSkills,
      company,
      experienceLevel,
      location,
      salary,
      jobType,} = req.body;
    if (!title || !requiredSkills) {
      return res.status(400).json({
        message: "Title and requiredSkills are required",
      });
    }
    const job = await Job.create({
        title,
      description,
      requiredSkills,
      company,
      experienceLevel,
      location,
      salary,
      jobType,
      postedBy: req.user.userId,
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
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching jobs",
    });
  }
};