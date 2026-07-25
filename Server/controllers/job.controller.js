import Job from "../models/job.model.js";
export const addjob = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      company,
      experienceLevel,
      location,
      salary,
      jobType,
    } = req.body;
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
export const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: "Your posted jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching your posted jobs",
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId; // Auth middleware se authenticated user id

    // Check if job exists and belongs to this recruiter
    const job = await Job.findOne({ _id: jobId, postedBy: userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;

    const job = await Job.findOneAndDelete({ _id: jobId, postedBy: userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
