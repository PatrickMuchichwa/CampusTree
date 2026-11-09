const authService = require("../services/authService");

// Controllers handle HTTP input/output.
// Business logic belongs in the service, not here.
const register = async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "Account registered successfully",
    data: result
  });
};

const login = async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result
  });
};

const me = async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);

  res.status(200).json({
    success: true,
    data: { user }
  });
};

module.exports = { register, login, me };
