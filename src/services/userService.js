const db = require('../db');

/**
 * Retrieve all users (id, username, email, created_at).
 */
const getAllUsers = async () => {
    const { rows } = await db.query(
        'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
};

/**
 * Retrieve a single user by id.
 * Returns null when not found.
 */
const getUserById = async (id) => {
    const { rows } = await db.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
};

/**
 * Create a new user.
 * @param {{ username: string, email: string }} data
 */
const createUser = async ({ username, email }) => {
    const { rows } = await db.query(
        `INSERT INTO users (username, email)
     VALUES ($1, $2)
     RETURNING id, username, email, created_at`,
        [username, email]
    );
    return rows[0];
};

/**
 * Update username and/or email for an existing user.
 * Returns null when not found.
 */
const updateUser = async (id, { username, email }) => {
    const { rows } = await db.query(
        `UPDATE users
     SET username = COALESCE($1, username),
         email    = COALESCE($2, email)
     WHERE id = $3
     RETURNING id, username, email, created_at`,
        [username ?? null, email ?? null, id]
    );
    return rows[0] ?? null;
};

/**
 * Delete a user by id.
 * Returns true when deleted, false when not found.
 */
const deleteUser = async (id) => {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return rowCount > 0;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };