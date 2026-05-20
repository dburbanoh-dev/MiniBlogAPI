require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db');

const run = async () => {
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('Running seed.sql …');
    await pool.query(sql);
    console.log('✅  Seed data inserted successfully.');
    await pool.end();
};

run().catch((err) => {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
});