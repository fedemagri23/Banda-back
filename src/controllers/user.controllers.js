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
  try {
    const { username, phone, mail, password } = req.body;

    /*
    Validaciones: 
    username: Al menos 6 caracteres, solo numeros, letras o "_", case insensitive
    phone: Solo numeros, al menos 10 caracteres
    mail: Contiene @
    password: al menos 6 caracteres
    */

    if (!username || username.length < 6) {
      return res.status(400).json({ error: "Username must be at least 6 characters long" });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: "Username can only contain letters, numbers or underscores" });
    }

    if (!phone || phone.length < 10) {
      return res.status(400).json({ error: "Phone number must be at least 10 characters long" });
    }
    
    if (!/^\d+$/.test(phone)) {
      return res.status(400).json({ error: "Phone number can only contain numbers" });
    }

    if (!mail || !mail.includes('@')) {
      return res.status(400).json({ error: "Email must contain @ symbol and be valid" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const passhash = await bcrypt.hash(password, salt);

    const response = await pool.query(
      `
      INSERT INTO useraccount (username, phone, mail, passhash) VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [username, phone, mail, passhash]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: error.message }); 
  }
};

export const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM useraccount");
  res.json(response.rows);
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const { rows } = await pool.query(
      "SELECT * FROM useraccount WHERE username = $1 OR mail = $1 OR phone = $1",
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
      { expiresIn: "6h" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: error.message });
  }
};
