const BaseModel = require("./BaseModel");
const db = require("../config/db");

class UserModel extends BaseModel {
  constructor() {
    // These names match the actual CampusTree_db SQL schema.
    super("User", "user_id");
  }

  async findByEmail(email, executor = db) {
    const [rows] = await executor.execute(
      "SELECT * FROM `User` WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  }

  // Return a user plus the role-specific profile, if one exists.
  async findWithRoleById(userId, executor = db) {
    const [rows] = await executor.execute(
      `SELECT u.user_id, u.full_name, u.email, u.phone, u.created_at,
              u.is_active,
              CASE
                WHEN a.admin_id IS NOT NULL THEN 'ADMIN'
                WHEN s.student_id IS NOT NULL THEN 'STUDENT'
                WHEN p.provider_id IS NOT NULL THEN 'PROVIDER'
                ELSE 'UNKNOWN'
              END AS role,
              s.student_id, s.student_number, s.institution,
              p.provider_id, p.business_name, p.description, p.is_verified,
              a.admin_id
       FROM \`User\` u
       LEFT JOIN \`Admin\` a ON a.user_id = u.user_id
       LEFT JOIN \`Student\` s ON s.user_id = u.user_id
       LEFT JOIN \`ServiceProvider\` p ON p.user_id = u.user_id
       WHERE u.user_id = ? LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }
}

module.exports = new UserModel();
