import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

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
      INSERT INTO useraccount (username, phone, mail, passhash) VALUES ($1, $2, $3, $4) RETURNING username, phone, mail
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
  const response = await pool.query("SELECT username, phone, mail FROM useraccount");
  res.json(response.rows);
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const { rows } = await pool.query(
      "SELECT id, username, phone, mail, passhash FROM useraccount WHERE username = $1 OR mail = $1 OR phone = $1",
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

    const userResponse = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      mail: user.mail
    };

    res.status(200).json({ message: "Login successful", token, user: userResponse });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar para generar código de verificación
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Función auxiliar para enviar correo
const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    secure: true,
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Change Verification Code",
    html: `
      <h1>Verification Code</h1>
      <p>Your verification code for changing your password is: <strong>${code}</strong></p>
      <p>This code will expire in 15 minutes.</p>
    `,
  });
};

export const requestPasswordChange = async (req, res) => {
  try {
    const { mail } = req.body;

    if (!mail || !mail.includes('@')) {
      return res.status(400).json({ error: "Email is required and must be valid" });
    }

    const { rows } = await pool.query(
      "SELECT * FROM useraccount WHERE mail = $1",
      [mail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No user found with this email address" });
    }

    const verificationCode = generateVerificationCode();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    await pool.query(
      `UPDATE useraccount 
       SET verification_code = $1, 
           verification_code_expires = $2 
       WHERE mail = $3`,
      [verificationCode, expirationTime, mail]
    );

    await sendVerificationEmail(mail, verificationCode);

    res.json({ message: "A verification code has been sent to your email" });
  } catch (error) {
    console.error("Error requesting password change:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { mail, verificationCode, newPassword } = req.body;

    if (!mail || !verificationCode || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    const { rows } = await pool.query(
      `SELECT * FROM useraccount 
       WHERE mail = $1 
       AND verification_code = $2 
       AND verification_code_expires > NOW()`,
      [mail, verificationCode]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired verification code" });
    }

    const salt = await bcrypt.genSalt(10);
    const passhash = await bcrypt.hash(newPassword, salt);

    await pool.query(
      `UPDATE useraccount 
       SET passhash = $1, 
           verification_code = NULL, 
           verification_code_expires = NULL 
       WHERE mail = $2`,
      [passhash, mail]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: error.message });
  }
};
