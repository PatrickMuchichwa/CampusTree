const db = require("../config/db");

// Only trusted SQL identifiers (table and column names) may be inserted
// into SQL strings. Values should always use ? placeholders.
const assertIdentifier = (name) => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error(`Invalid SQL identifier: ${name}`);
  }
  return `\`${name}\``;
};

class BaseModel {
  constructor(tableName, primaryKey = "id") {
    this.table = assertIdentifier(tableName);
    this.pk = assertIdentifier(primaryKey);
  }

  // executor can be the normal pool OR a transaction connection.
  async findById(id, executor = db) {
    const [rows] = await executor.execute(
      `SELECT * FROM ${this.table} WHERE ${this.pk} = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findAll(where = {}, orderBy = null, executor = db) {
    const keys = Object.keys(where);
    let sql = `SELECT * FROM ${this.table}`;
    const values = [];

    if (keys.length) {
      // Validate column names, while parameterizing their values.
      const conditions = keys.map((key) => `${assertIdentifier(key)} = ?`);
      sql += ` WHERE ${conditions.join(" AND ")}`;
      values.push(...Object.values(where));
    }

    // orderBy is restricted to a column name and optional ASC/DESC.
    const sort = orderBy || `${this.pk.replaceAll("`", "")} DESC`;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)(?:\s+(ASC|DESC))?$/i.exec(sort);
    if (!match) throw new Error("Invalid orderBy value");
    sql += ` ORDER BY ${assertIdentifier(match[1])} ${match[2] || "ASC"}`;

    const [rows] = await executor.execute(sql, values);
    return rows;
  }

  async create(data, executor = db) {
    const keys = Object.keys(data);
    if (!keys.length) throw new Error("Cannot create a record with no fields");

    const columns = keys.map(assertIdentifier).join(", ");
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`;
    const [result] = await executor.execute(sql, Object.values(data));
    return result.insertId;
  }

  async update(id, data, executor = db) {
    const keys = Object.keys(data);
    if (!keys.length) throw new Error("No fields supplied for update");

    const assignments = keys.map((key) => `${assertIdentifier(key)} = ?`);
    const sql = `UPDATE ${this.table} SET ${assignments.join(", ")} WHERE ${this.pk} = ?`;
    const [result] = await executor.execute(sql, [...Object.values(data), id]);
    return result.affectedRows > 0;
  }

  async delete(id, executor = db) {
    const [result] = await executor.execute(
      `DELETE FROM ${this.table} WHERE ${this.pk} = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = BaseModel;
