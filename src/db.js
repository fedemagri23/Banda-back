import pg from "pg";
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from "./config.js";

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});