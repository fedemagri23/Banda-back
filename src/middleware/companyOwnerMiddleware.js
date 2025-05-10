import { pool } from "../db.js";

function checkPrivilege(
  role,
  privilege_code
) {
  if (!role.movements_view && (privilege_code[0] == '1')) {
    return false;
  }
  if (!role.movements_edit && (privilege_code[1] == '1')) {
    return false;
  }
  if (!role.employees_view && (privilege_code[2] == '1')) {
    return false;
  }
  if (!role.employees_edit && (privilege_code[3] == '1')) {
    return false;
  }
  if (!role.contact_view && (privilege_code[4] == '1')) {
    return false;
  }
  if (!role.contact_edit && (privilege_code[5] == '1')) {
    return false;
  }
  if (!role.billing_view && (privilege_code[6] == '1')) {
    return false;
  }
  if (!role.billing_edit && (privilege_code[7] == '1')) {
    return false;
  }
  if (!role.inventory_view && (privilege_code[8] == '1')) {
    return false;
  }
  return true;
}

export function checkCompanyRole(
  privilege_code,
) {
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
      // User is not owner
      const { rows } = await pool.query(
        `SELECT 
        movements_view,
        movements_edit,
        employees_view,
        employees_edit,
        contact_view,
        contact_edit,
        billing_view,
        billing_edit,
        inventory_view 
        FROM works_for JOIN company_role ON works_for.role = company_role.id 
        WHERE works_for.user_id = $1 and works_for.company_id = $2`,
        [userId, companyId]
      );

      if (rows.length == 0) {
        return res
          .status(400)
          .json({ error: "Permission denied - User is not employee or owner" });
      }

      const role = rows[0];

      if (
        !checkPrivilege(
          role,
          privilege_code
        )
      ) {
        return res
          .status(403)
          .json({ error: "Permission denied - Role not accepted" });
      }

      next();
    } else {
      next();
    }
  };
}
