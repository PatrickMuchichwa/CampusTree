const AppError = require("../utils/AppError");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateRegister = (req, res, next) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role) {
    return next(new AppError("full_name, email, password and role are required", 400));
  }

  if (typeof full_name !== "string" || full_name.trim().length < 2 || full_name.length > 100) {
    return next(new AppError("full_name must be between 2 and 100 characters", 400));
  }

  if (typeof email !== "string" || !isEmail(email)) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  // bcrypt has a 72-byte input limit. Reject longer passwords rather than
  // silently hashing only part of a password.
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return next(new AppError("Password must be at least 8 characters and no more than 72 UTF-8 bytes", 400));
  }

  if (!["STUDENT", "PROVIDER"].includes(role)) {
    return next(new AppError("Public registration supports STUDENT or PROVIDER accounts", 400));
  }

  if (role === "STUDENT") {
    if (!req.body.student_number || !req.body.institution) {
      return next(new AppError("student_number and institution are required for students", 400));
    }
  }

  if (role === "PROVIDER" && !req.body.business_name) {
    return next(new AppError("business_name is required for providers", 400));
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || !isEmail(email) || typeof password !== "string" || !password) {
    return next(new AppError("A valid email and password are required", 400));
  }

  next();
};

module.exports = { validateRegister, validateLogin };
