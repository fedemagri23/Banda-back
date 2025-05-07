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
    const { name, email, cuit, app_password, country, industry } = req.body;

    /*
    Validaciones: 
    name: Al menos 3 caracteres, sin caracteres especiales, acepta espacios, estos se normalizan.
    email: Debe ser un email válido
    app_password: Debe ser un password válido para el email de la compañía
    */

    //TODO: Validar app_password

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Company name is required and must be text" });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: "Company email is required" });
    }

    const normalizedName = name.trim().replace(/\s+/g, ' ');

    if (normalizedName.length < 3) {
      return res.status(400).json({ error: "Name must be at least 3 characters long" });
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(normalizedName)) {
      return res.status(400).json({ error: "Name cannot contain special characters" });
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const companyExists = await pool.query(
      `SELECT * FROM company WHERE name = $1 AND user_id = $2`,
      [normalizedName, userId]
    );
    
    if (companyExists.rows.length > 0) {
      return res.status(400).json({ error: "Company already exists" });
    }

    const emailExists = await pool.query(
      `SELECT * FROM company WHERE email = $1`,
      [email]
    );
    
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const response = await pool.query(
      `
      INSERT INTO company (name, cuit, email, app_password, user_id, country, industry) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `,
      [normalizedName, cuit, email, app_password, userId, country, industry]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Error adding company:", error.message);
    res.status(500).json({ error: error.message }); 
  }
};

export const getCompaniesFromUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const response = await pool.query(`
      SELECT c.name, c.cuit, c.id, c.country, c.industry,
             CASE WHEN c.user_id = $1 THEN true ELSE false END as "isOwner"
      FROM company c
      LEFT JOIN works_for wf ON c.id = wf.company_id
      WHERE c.user_id = $1 OR (wf.user_id = $1 AND wf.accepted = true)
    `, [userId]);

    res.json(response.rows);
  } catch (error) {
    console.error("Error getting companies:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  const userId = req.user.userId;
  const companyId = req.params.companyId;

  const response = await pool.query(
    "SELECT * FROM company WHERE id=$1 AND user_id=$2",
    [companyId, userId]
  );

  if (response.rows.length === 0) {
    return res.status(404).json({ error: "Company not found" });
  }

  res.json(response.rows[0]);
}

