const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Example protected route. Only a logged-in ADMIN can access it.
router.get("/dashboard", authenticate, authorizeRoles("ADMIN"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the admin dashboard",
    userId: req.user.userId
  });
});

module.exports = router;
