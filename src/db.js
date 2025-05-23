import pg from "pg";

/** 
 * IMPORTANTE: Definir en .env la variable DATABASE_URL
 * pero tambien definir las variables PGUSER, PGHOST, PGPASSWORD, PGDATABASE y PGPORT
 * para que algunas cosas como los tests funcionen correctamente
 */

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
