// backend/config/db.js
//
// Central PostgreSQL connection pool.
// Uses a plain connection string from .env (DATABASE_URL) — no auth tokens,
// no daily refresh. Set it once and it keeps working.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('PostgreSQL pool: new client connected');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Simple helper so controllers/services can do: const { rows } = await db.query(sql, params)
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
