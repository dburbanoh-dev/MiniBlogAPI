require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db');

const run = async () => {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log('Running schema.sql …');
    await pool.query(sql);
    console.log('✅  Schema created/updated successfully.');
    await pool.end();
};

run().catch((err) => {
    console.error('❌  Setup failed:', err.message);
    process.exit(1);
});