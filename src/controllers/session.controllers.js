import { pool } from "../db.js";

export const getSession = async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const response = await pool.query(
      `
      SELECT * FROM session
      WHERE id = $1
      `,
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error fetching session:", error.message);
    return res.status(500).json({ error: "Failed to fetch session" });
  }
};

export const createSession = async (req, res) => {
  const { id, user_id, expires_at } = req.body;

  if (!id || !user_id || !expires_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (isNaN(Date.parse(expires_at))) {
    return res
      .status(400)
      .json({ error: "Invalid date format for expires_at" });
  }

  if (new Date(expires_at) <= new Date()) {
    return res.status(400).json({ error: "expires_at must be in the future" });
  }

  try {
    const response = await pool.query(
      `
      INSERT INTO session (id, user_id, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id, user_id, expires_at]
    );
    return res.status(201).json({
      message: "Session created successfully",
      session: response.rows[0],
    });
  } catch (error) {
    console.error("Error creating session:", error.message);
    return res.status(500).json({ error: "Failed to create session" });
  }
};

export const invalidateSession = async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    await pool.query(
      `
      DELETE FROM session
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (res.rowCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res
      .status(200)
      .json({ message: "Session invalidated successfully" });
  } catch (error) {
    console.error("Error invalidating session:", error.message);
    return res.status(500).json({ error: "Failed to invalidate session" });
  }
};

export const invalidateUserSessions = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id || typeof user_id !== "string" || user_id.trim() === "") {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    await pool.query(
      `
      DELETE FROM session
      WHERE user_id = $1
      RETURNING *
      `,
      [user_id]
    );

    if (res.rowCount === 0) {
      return res.status(404).json({ error: "No sessions found for this user" });
    }

    return res
      .status(200)
      .json({ message: "User sessions invalidated successfully" });
  } catch (error) {
    console.error("Error invalidating user sessions:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to invalidate user sessions" });
  }
};
