const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = require("../models/UserModel");
const Student = require("../models/StudentModel");
const Provider = require("../models/ProviderModel");
const AppError = require("../utils/AppError");

const rounds = Number(process.env.BCRYPT_ROUNDS || 12);

// Remove password_hash before any user object is sent to the frontend.
const safeUser = (user) => {
  if (!user) return null;
  const { password_hash, ...publicUser } = user;
  return publicUser;
};

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  // The token contains only identifiers and role information, not passwords.
  return jwt.sign(
    { sub: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

const register = async (input) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const email = input.email.trim().toLowerCase();
    const existingUser = await User.findByEmail(email, connection);

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    // Hash the password. Never store the original/plain-text password.
    const password_hash = await bcrypt.hash(input.password, rounds);

    const userId = await User.create({
      full_name: input.full_name.trim(),
      email,
      password_hash,
      phone: input.phone || null
    }, connection);

    let role;

    // Create the matching role profile in the same transaction.
    // If this step fails, the User insert is rolled back too.
    if (input.role === "STUDENT") {
      await Student.create({
        user_id: userId,
        student_number: input.student_number.trim(),
        institution: input.institution.trim()
      }, connection);
      role = "STUDENT";
    } else if (input.role === "PROVIDER") {
      await Provider.create({
        user_id: userId,
        business_name: input.business_name.trim(),
        description: input.description || null
      }, connection);
      role = "PROVIDER";
    } else {
      throw new AppError("Role must be STUDENT or PROVIDER", 400);
    }

    await connection.commit();

    const user = await User.findWithRoleById(userId);
    const token = createToken({ user_id: userId, role });

    return { user: safeUser(user), token };
  } catch (error) {
    await connection.rollback();

    // MySQL duplicate-key errors can also happen for student_number.
    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError("Email or student number is already registered", 409);
    }
    throw error;
  } finally {
    connection.release();
  }
};

const login = async ({ email, password }) => {
  const userRecord = await User.findByEmail(email.trim().toLowerCase());

  // Use the same message for an unknown email and incorrect password.
  if (!userRecord || !(await bcrypt.compare(password, userRecord.password_hash))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!userRecord.is_active) {
    throw new AppError("This account has been deactivated", 403);
  }

  const user = await User.findWithRoleById(userRecord.user_id);
  if (!user || user.role === "UNKNOWN") {
    throw new AppError("This account does not have a valid role profile", 403);
  }

  return {
    user: safeUser(user),
    token: createToken(user)
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findWithRoleById(userId);
  if (!user || !user.is_active) {
    throw new AppError("User account not found or inactive", 404);
  }
  return safeUser(user);
};

module.exports = { register, login, getCurrentUser };
