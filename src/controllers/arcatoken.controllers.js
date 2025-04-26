import { pool } from "../db.js";

export async function getArcaToken(req, res) {
  const { user_id, cuit } = req.params;

  if (!user_id || typeof user_id !== "string" || user_id.trim() === "") {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  if (!cuit || typeof cuit !== "string" || cuit.trim() === "") {
    return res.status(400).json({ error: "Invalid CUIT" });
  }

  const token = await pool.query(
    `
    SELECT token, sign, expiration FROM user_arca_tokens
    WHERE user_id = $1 AND cuit = $2
  `,
    [user_id, cuit]
  );

  if (
    token.rows.length === 0 ||
    new Date(token.rows[0].expiration) <= new Date()
  ) {
    return res.status(404).json({ error: "TA not found or expired" });
  }

  res.json(token.rows[0]);
}

export async function upsertArcaToken(req, res) {
  const { user_id, cuit } = req.params;
  const { token, sign, expiration } = req.body;

  await pool.query(
    `
    INSERT INTO user_arca_tokens (user_id, cuit, token, sign, expiration, updated_at)
    VALUES ($1, $2, $3, $4, $5, now())
    ON CONFLICT (user_id, cuit)
    DO UPDATE SET token = $3, sign = $4, expiration = $5, updated_at = now()
  `,
    [user_id, cuit, token, sign, expiration]
  );

  res.status(200).json({ message: "TA saved" });
}

export async function deleteArcaToken(req, res) {
  const { user_id, cuit } = req.params;
  await pool.query(
    `
    DELETE FROM user_arca_tokens WHERE user_id = $1 AND cuit = $2
  `,
    [user_id, cuit]
  );

  res.status(204).send();
}
