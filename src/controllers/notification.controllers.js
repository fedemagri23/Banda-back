import { pool } from "../db.js";
import { format } from 'date-fns';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await pool.query(
      `SELECT useraccount.username, company.name, works_for.added_at FROM works_for 
       JOIN company ON works_for.company_id = company.id
       JOIN useraccount ON works_for.user_id = useraccount.id
       WHERE works_for.user_id = $1 AND accepted = false ORDER BY added_at DESC`,
      [userId]
    );

    const formattedNotifications = notifications.rows.map(notification => ({
      message: "You have a new company invitation",
      from_company: notification.name,
      from_username: notification.username,
      created_at: notification.added_at, 
    }));

    res.json(formattedNotifications);

  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const acceptInvitation = async (req, res) => {
  try {
    const { companyId } = req.params;
    const userId = req.user.userId;

    const response = await pool.query(
      `UPDATE works_for SET accepted = true WHERE company_id = $1 AND user_id = $2 RETURNING *`,
      [companyId, userId]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    res.json({ message: "Invitation accepted successfully" });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};