const AppError = require("../utils/AppError");

// Usage: authorizeRoles("ADMIN") or authorizeRoles("ADMIN", "PROVIDER").
// Authentication must run before this middleware.
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Please log in first", 401));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to access this resource", 403));
  }

  next();
};

module.exports = { authorizeRoles };
