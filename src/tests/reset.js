/**
 * Este script usa unicamente los scripts SQL y no la API.
 */

import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;
import fs from "fs/promises";

dotenv.config();

const internalApiPort = process.env.PORT || 3001;

async function resetDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  console.log("DB reset in progress...");

  const sql = await fs.readFile("database/db.sql", "utf-8");
  const invoice_sql = await fs.readFile("database/invoices.sql", "utf-8");
  const inflation_sql = await fs.readFile("database/inflation.sql", "utf-8");
  const seed_sql = await fs.readFile("database/seed.sql", "utf-8");

  await client.query(sql);
  await client.query(seed_sql);
  await client.query(invoice_sql);
  await client.query(inflation_sql);
  await client.end();

  console.log("DB Reset completed");
}

await resetDatabase();
