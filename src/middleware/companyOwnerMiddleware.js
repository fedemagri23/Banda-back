import { pool } from "../db.js";

export const checkCompanyOwner = async (req, res, next) => {
    const userId = req.user.userId;
    const id = req.params.companyId;

    const { rows } = await pool.query(
      "SELECT user_id FROM company WHERE id = $1",
      [id]
    );
  
    if (rows.length == 0) {
      return res.status(400).json({ error: "Company not found" });
    }
  
    const company = rows[0];
  
    if (userId != company.user_id) {
      return res.status(403).json({ error: "Permission denied - Not company owner" });
    }
  
    next();
  };