import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*

Send ID via hotpost:
  const id = parseInt(req.params.id);

Get ID from auth token:
  const userId = req.user.userId;

*/

export const register = async (req, res) => {
  const {username, phone, mail, passhash} = req.body;

  const response = await pool.query(`
    INSERT INTO useraccount (username, phone, mail, passhash) VALUES ($1, $2, $3, $4) RETURNING *
    `, [username, phone, mail, passhash]);

  res.json(response.rows[0]);
};

// GET EXAMPLE
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await pool.query(
    "SELECT * FROM useraccount WHERE id = $1",
    [id]
  );
  res.json(response.rows[0]);
};

// REGISTRATION EXAMPLE
export const createUser = async (req, res) => {
  try {
    const {
      name,
      surname,
      username,
      email,
      password,
      phone_number,
      birth_date,
      profile_picture,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passhash = await bcrypt.hash(password, salt);

    const { rows } = await pool.query(
      "INSERT INTO users (name, surname, username, email, passhash, phone_number, birth_date, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        name,
        surname,
        username,
        email,
        passhash,
        phone_number,
        birth_date,
        profile_picture,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// LOGIN EXAMPLE
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $1 OR phone_number = $1",
      [identifier]
    );

    const user = rows[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.passhash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: error.message });
  }
};
