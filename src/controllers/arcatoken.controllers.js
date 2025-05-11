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
  const { token, sign } = req.body;

  // Calculate expiration as 11 hours from now
  const expiration = new Date(Date.now() + 11 * 60 * 60 * 1000).toISOString();

  await pool.query(
    `
    INSERT INTO user_arca_tokens (user_id, cuit, token, sign, expiration, updated_at)
    VALUES ($1, $2, $3, $4, $5, now())
    ON CONFLICT (user_id, cuit)
    DO UPDATE SET token = $3, sign = $4, expiration = $5, updated_at = now()
  `,
    [user_id, cuit, token, sign, expiration]
  );

  res.status(200).json({ message: "TA saved", expiration });
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

// Obtener certificado y llave privada (encriptados) para un usuario y cuit
export async function getCompanyCertificate(req, res) {
  const { companyId } = req.params;

  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    return res.status(400).json({ error: "Invalid CUIT" });
  }

  const certificate = await pool.query(
    `
    SELECT certificate, private_key FROM company_certificates
    WHERE company_id = $1
  `,
    [companyId]
  );

  if (certificate.rows.length === 0) {
    return res.status(404).json({ error: "Certificate not found" });
  }

  res.json(certificate.rows[0]);
}

// Crear o actualizar certificado y llave privada para un usuario y cuit
export async function upsertUserCertificate(req, res) {
  const { companyId } = req.params;
  const { certificate, private_key } = req.body;

  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    return res.status(400).json({ error: "Invalid company id" });
  }

  if (
    !certificate ||
    typeof certificate !== "string" ||
    certificate.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid certificate" });
  }

  if (
    !private_key ||
    typeof private_key !== "string" ||
    private_key.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid private key" });
  }

  await pool.query(
    `
    INSERT INTO company_certificates (company_id, certificate, private_key, updated_at)
    VALUES ($1, $2, $3, now())
    ON CONFLICT (company_id)
    DO UPDATE SET certificate = $2, private_key = $3, updated_at = now()
  `,
    [companyId, certificate, private_key]
  );

  res.status(200).json({ message: "Certificate saved" });
}

// Eliminar certificado y llave privada para un usuario y cuit
export async function deleteUserCertificate(req, res) {
  const { companyId } = req.params;

  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    return res.status(400).json({ error: "Invalid company id" });
  }

  await pool.query(
    `
    DELETE FROM company_certificates WHERE company_id = $1
  `,
    [user_id, cuit]
  );

  res.status(204).send();
}
