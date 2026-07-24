import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Resume must be 5 MB or smaller."
          : err.message,
    });
  }

  if (err.message === "Only PDF resume files are allowed.") {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};