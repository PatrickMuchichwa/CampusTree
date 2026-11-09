// Central error handler. Express recognizes this function because it has
// four parameters: (error, request, response, next).
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log the full error on the server, but do not expose stack traces to clients.
  console.error(err);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === "production"
      ? "An unexpected server error occurred"
      : err.message || "Internal server error"
  });
};

module.exports = errorMiddleware;
