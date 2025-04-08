import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*

Send ID via hotpost:
  const id = parseInt(req.params.id);

Get ID from auth token:
  const userId = req.user.userId;

*/

export const addCompany = async (req, res) => {
  try {
    const { userId } = req.user.userId
    const { name } = req.body;

    /*
    Validaciones: 
    name: Al menos 3 caracteres, sin caracteres especiales, acepta espacios, estos se normalizan.
    */

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "El nombre de la empresa es requerido y debe ser texto" });
    }

    const normalizedName = name.trim().replace(/\s+/g, ' ');

    if (normalizedName.length < 3) {
      return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres" });
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(normalizedName)) {
      return res.status(400).json({ error: "El nombre no puede contener caracteres especiales" });
    }

    const response = await pool.query(
      `
      INSERT INTO company (name, user_id) VALUES ($1, $2) RETURNING *
      `,
      [normalizedName, userId]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Error adding company:", error.message);
    res.status(500).json({ error: error.message }); 
  }
};

export const getCompanies = async (req, res) => {
  const response = await pool.query("SELECT * FROM company");
  res.json(response.rows);
};