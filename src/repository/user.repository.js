const db = require("../database/pg.database");
const bcrypt = require("bcryptjs");

exports.createUser = async (user) => {
  try {
    const res = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [user.name, user.email, user.password]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = res.rows[0];

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.getUserByEmail = exports.findUserByEmail;

exports.updateUser = async (user) => {
  try {
    const existingUser = await db.query("SELECT * FROM users WHERE id = $1", [user.id]);
    if (existingUser.rows.length === 0) {
      return null;
    }

    const res = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [user.name, user.email, user.password, user.id]
    );

    return res.rows[0] || null;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.deleteUser = async (id) => {
  try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

// 🔹 FIX: Gunakan `db.query` bukan `db.execute`
exports.updateUserBalance = async (email, newBalance) => {
  try {
    const query = "UPDATE users SET balance = $1 WHERE email = $2 RETURNING *";
    const res = await db.query(query, [newBalance, email]);
    return res.rows[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};

// 🔹 FIX: Gunakan `db.query` bukan `db.execute`
exports.findUserById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};
