import { pool } from "../db.js";

/*

Send ID via hotpost:
  const id = parseInt(req.params.id);

Get ID from auth token:
  const userId = req.user.userId;

*/

export const addCompany = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    /*
    Validaciones: 
    name: Al menos 3 caracteres, sin caracteres especiales, acepta espacios, estos se normalizan.
    */

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Company name is required and must be text" });
    }

    const normalizedName = name.trim().replace(/\s+/g, ' ');

    if (normalizedName.length < 3) {
      return res.status(400).json({ error: "Name must be at least 3 characters long" });
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(normalizedName)) {
      return res.status(400).json({ error: "Name cannot contain special characters" });
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

export const getCompaniesFromUser = async (req, res) => {
  const userId = req.user.userId;
  const response = await pool.query("SELECT * FROM company WHERE id=$1", [userId]);
  res.json(response.rows);
};