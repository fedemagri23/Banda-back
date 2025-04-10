import { pool } from "../db.js";

export const addPurchaseOrder = async (req, res) => {
  const { companyId, condition, supplier_id, proof_code, proof_type } = req.body;
  
  try {
    /*
    Validaciones:  
    */

    const response = await pool.query(
      `
      INSERT INTO ____ (_, _) VALUES ($1, $2) RETURNING *
      `,
      [__, __]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Error creating purchase item:", error.message);
    res.status(500).json({ error: error.message });
  }
};
