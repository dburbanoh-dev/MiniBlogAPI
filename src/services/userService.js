const db = require('../db');

/**
 * Devuelve todos los usuarios (id, username, email, created_at).
 */
const getAllUsers = async () => {
    const { rows } = await db.query(
        'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
};

/**
 * Recupera un único usuario por su ID.
 * Devuelve null si no se encuentra.
 */
const getUserById = async (id) => {
    const { rows } = await db.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
};

/**
 * Crea un nuevo usuario.
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
 * Actualiza el nombre de usuario y el correo electrónico de un usuario existente.
 * Devuelve null si no se encuentra.
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
 * Elimina a un usario por id
 * devuelve true cuando se elimina, false cuando no se encuntrs
 */
const deleteUser = async (id) => {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return rowCount > 0;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };