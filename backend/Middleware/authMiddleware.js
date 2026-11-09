const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// Verify the JWT sent in the Authorization header.
// Expected format: Authorization: Bearer <token>
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Authentication token is required", 401));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified identity to the request.
    // Controllers and later middleware can now access req.user.
    req.user = {
      userId: Number(decoded.sub),
      role: decoded.role
    };

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired authentication token", 401));
  }
};

module.exports = { authenticate };
