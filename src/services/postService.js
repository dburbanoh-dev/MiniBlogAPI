const db = require('../db');

/**
 * Recupera todas las publicaciones, agrupadas por nombre de usuario del autor..
 * Opcionalmente, puedes filtrar por ID de usuario..
 */
const getAllPosts = async (userId) => {
    const base = `
    SELECT p.id, p.title, p.body, p.published, p.created_at, p.updated_at,
           u.id AS user_id, u.username AS author
    FROM posts p
    JOIN users u ON u.id = p.user_id
  `;

    if (userId) {
        const { rows } = await db.query(
            base + ' WHERE p.user_id = $1 ORDER BY p.created_at DESC',
            [userId]
        );
        return rows;
    }

    const { rows } = await db.query(base + ' ORDER BY p.created_at DESC');
    return rows;
};

/**
 * Recupera una sola publicación por ID.
* Devuelve null si no se encuentra.
 */
const getPostById = async (id) => {
    const { rows } = await db.query(
        `SELECT p.id, p.title, p.body, p.published, p.created_at, p.updated_at,
            u.id AS user_id, u.username AS author
     FROM posts p
     JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
        [id]
    );
    return rows[0] ?? null;
};

/**
 * Crea un nuevo post.
 * @param {{ title: string, body: string, published?: boolean, user_id: number }} data
 */
const createPost = async ({ title, body, published = false, user_id }) => {
    const { rows } = await db.query(
        `INSERT INTO posts (title, body, published, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, body, published, user_id, created_at, updated_at`,
        [title, body, published, user_id]
    );
    return rows[0];
};

/**
 *Actualiza un post por id.
 * Retorna null cuando no se encuentra.
 */
const updatePost = async (id, { title, body, published }) => {
    const { rows } = await db.query(
        `UPDATE posts
     SET title     = COALESCE($1, title),
         body      = COALESCE($2, body),
         published = COALESCE($3, published),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, title, body, published, user_id, created_at, updated_at`,
        [title ?? null, body ?? null, published ?? null, id]
    );
    return rows[0] ?? null;
};

/**
 * Elimina un post por id.
 * Retorna true cuando elimina, false cuando no encuentra
 */
const deletePost = async (id) => {
    const { rowCount } = await db.query('DELETE FROM posts WHERE id = $1', [id]);
    return rowCount > 0;
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };