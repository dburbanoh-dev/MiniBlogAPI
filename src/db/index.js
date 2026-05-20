require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: process.env.DB_PORT,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,

});

pool.on('error', (err) => {
    console.error('Unexpected DB error:', err);
});

/**
 * Execute a parameterised query.
 * @param {string} text  SQL string with $1, $2 … placeholders
 * @param {Array}  params  Values for placeholders
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };