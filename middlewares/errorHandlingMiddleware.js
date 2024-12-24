export const ErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({
    status: "error",
    message,
    details: error.details || error.message,
  });
};
