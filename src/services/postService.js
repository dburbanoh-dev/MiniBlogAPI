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
    const fields = [];
    const values = [];
    let placeholderIndex = 1;

    // Iteramos sobre las propiedades que vienen en el body
    for (const [key, value] of Object.entries(postData)) {
        if (value !== undefined) { // Solo añadimos lo que el cliente envió
            fields.push(`${key} = $${placeholderIndex}`);
            values.push(value);
            placeholderIndex++;
        }
    }

    // Si el body venía vacío, no hacemos nada
    if (fields.length === 0) {
        const { rows } = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
        return rows[0];
    }

    // Añadimos siempre la fecha de actualización
    fields.push(`updated_at = NOW()`);

    // El ID será el último parámetro
    values.push(id);
    const query = `
        UPDATE posts 
        SET ${fields.join(', ')} 
        WHERE id = $${placeholderIndex} 
        RETURNING *;
    `;

    const { rows } = await db.query(query, values);
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