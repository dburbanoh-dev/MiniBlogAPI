// src/services/postService.js
const db = require('../db'); // Asegúrate de que esta ruta apunte a tu conexión de Postgres

const getAllPosts = async () => {
    const { rows } = await db.query('SELECT * FROM posts ORDER BY id ASC;');
    return rows;
};

const getPostById = async (id) => {
    const { rows } = await db.query('SELECT * FROM posts WHERE id = $1;', [id]);
    return rows[0];
};

const createPost = async (postData) => {
    const { title, body, published, user_id } = postData;
    const query = `
        INSERT INTO posts (title, body, published, user_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;
    const { rows } = await db.query(query, [title, body, published || false, user_id]);
    return rows[0];
};

const updatePost = async (id, postData) => {
    const { title, body, published, user_id } = postData;
    const query = `
        UPDATE posts 
        SET title = $1, body = $2, published = $3, user_id = $4, updated_at = NOW()
        WHERE id = $5 
        RETURNING *;
    `;
    const { rows } = await db.query(query, [title, body, published, user_id, id]);
    return rows[0];
};

const deletePost = async (id) => {
    const { rows } = await db.query('DELETE FROM posts WHERE id = $1 RETURNING *;', [id]);
    return rows[0];
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};