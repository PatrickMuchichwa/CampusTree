const express = require("express");
const controller = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");
const { validateRegister, validateLogin } = require("../middleware/validateAuth");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", validateRegister, asyncHandler(controller.register));

// POST /api/auth/login
router.post("/login", validateLogin, asyncHandler(controller.login));

// GET /api/auth/me - returns the currently logged-in user's profile.
router.get("/me", authenticate, asyncHandler(controller.me));

module.exports = router;
