// db/index.js
require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
    isProduction
        ? {
            connectionString: process.env.DATABASE_URL,
            /* Quitamos el objeto 'ssl: { rejectUnauthorized: false }' 
               ya que Railway no lo requiere internamente.
            */
        }
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: String(process.env.DB_PASSWORD),
            port: process.env.DB_PORT,
        }
);

pool.on('error', (err) => {
    console.error('Unexpected DB error:', err);
});

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };