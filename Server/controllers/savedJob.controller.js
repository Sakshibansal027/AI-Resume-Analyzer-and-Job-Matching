import SavedJob from "../models/savedJob.model.js";


export const saveJob = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { jobTitle, company, applyLink } = req.body;

    const alreadySaved = await SavedJob.findOne({
      userId,
      applyLink,
    });

    if (alreadySaved) {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    const job = await SavedJob.create({
      userId,
      jobTitle,
      company,
      applyLink,
    });

    res.status(201).json({
      message: "Job saved",
      data: job,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const jobs = await SavedJob.find({ userId });

    res.status(200).json({
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;

    const deletedJob = await SavedJob.findOneAndDelete({
      _id: jobId,
      userId,
    });

    if (!deletedJob) {
      return res.status(404).json({
        message: "Saved job not found.",
      });
    }

    res.status(200).json({
      message: "Job removed.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};