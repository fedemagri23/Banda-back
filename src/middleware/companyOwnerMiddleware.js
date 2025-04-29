import { pool } from "../db.js";

export function checkCompanyRole(privilege) {
  /*
    1: Owner
    2: Employee
  */
  return async (req, res, next) => {
    const userId = req.user.userId;
    const companyId = req.params.companyId;

    var { rows } = await pool.query(
      "SELECT user_id FROM company WHERE id = $1",
      [companyId]
    );

    if (rows.length == 0) {
      return res.status(400).json({ error: "Company not found" });
    }

    const company = rows[0];

    if (userId != company.user_id) {
      const { rows } = await pool.query(
        "SELECT role FROM works_for WHERE user_id = $1 and company_id = $2",
        [userId, companyId]
      );

      if (rows.length == 0) {
        return res
          .status(400)
          .json({ error: "Permission denied - User is not employee or owner" });
      }

      const role = rows[0]?.role;

      if (role > privilege) {
        return res
          .status(403)
          .json({ error: "Permission denied - Role not accepted" });
      }

      next();
    }
    else {
      next();
    }
  };
}
