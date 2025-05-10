import { pool } from "../db.js";

export const addEmployee = async (req, res) => {
  try {
    const { username, employeeRole } = req.body;
    const company_id = req.params.companyId;

    const userResult = await pool.query(
      "SELECT id FROM useraccount WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const employeeId = userResult.rows[0].id;

    const existingEmployee = await pool.query(
      "SELECT * FROM works_for WHERE user_id = $1 AND company_id = $2",
      [employeeId, company_id]
    );

    if (existingEmployee.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Employee is already part of this company" });
    }

    const response = await pool.query(
      "INSERT INTO works_for (user_id, company_id, role) VALUES ($1, $2, $3) RETURNING *",
      [employeeId, company_id, employeeRole]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Error adding employee:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const removeEmployee = async (req, res) => {
  const { employeeId, employeeRole } = req.body;
  const company_id = req.params.companyId;

  const response = await pool.query(
    "DELETE FROM works_for WHERE user_id = $1 AND company_id = $2 AND role = $3 RETURNING *",
    [employeeId, company_id, employeeRole]
  );

  res.json(response.rows);
};

export const getEmployees = async (req, res) => {
  const userId = req.user.userId;
  const company_id = req.params.companyId;

  const response = await pool.query(
    `
      SELECT u.id, u.username, u.phone, u.mail, w.role
      FROM useraccount u
      JOIN works_for w ON u.id = w.user_id
      WHERE w.company_id = $1 AND w.user_id != $2 AND w.accepted = true`,
    [company_id, userId]
  );

  res.json(response.rows);
};

export const createRole = async (req, res) => {
  try {
    const {
      name,
      movements_view,
      movements_edit,
      employees_view,
      employees_edit,
      contact_view,
      contact_edit,
      billing_view,
      Billing_edit,
      inventory_view,
    } = req.body;
    const company_id = req.params.companyId;

    const response = await pool.query(
      `INSERT INTO company_role (
        name, 
        movements_view, 
        movements_edit, 
        employees_view, 
        employees_edit, 
        contact_view, 
        contact_edit, 
        billing_view, 
        billing_edit, 
        inventory_view,
        company_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        name,
        movements_view,
        movements_edit,
        employees_view,
        employees_edit,
        contact_view,
        contact_edit,
        billing_view,
        Billing_edit,
        inventory_view,
        company_id,
      ]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Error creating role:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getRoles = async (req, res) => {
  const company_id = req.params.companyId;

  try {
    const response = await pool.query(
      "SELECT * FROM company_role WHERE company_id = $1",
      [company_id]
    );

    res.json(response.rows);
  } catch (error) {
    console.error("Error getting roles:", error.message);
    res.status(500).json({ error: error.message });
  }
};