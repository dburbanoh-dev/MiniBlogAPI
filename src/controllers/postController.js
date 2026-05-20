const { validationResult } = require('express-validator');
const postService = require('../services/postService');

// 1. OBTENER TODOS LOS POSTS (GET /posts)
const getPosts = async (req, res, next) => {
    try {
        const posts = await postService.getAllPosts();
        res.json({ data: posts });
    } catch (err) {
        next(err);
    }
};

// 2. OBTENER UN POST POR ID (GET /posts/:id)
const getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json({ data: post });
    } catch (err) {
        next(err);
    }
};

// 3. CREAR UN NUEVO POST (POST /posts)
const createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const newPost = await postService.createPost(req.body);
        res.status(201).json({ data: newPost });
    } catch (err) {
        next(err);
    }
};

// 4. ACTUALIZAR UN POST EXISTENTE (PUT /posts/:id)
const updatePost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const updatedPost = await postService.updatePost(req.params.id, req.body);
        if (!updatedPost) return res.status(404).json({ error: 'Post not found' });

        res.json({ data: updatedPost });
    } catch (err) {
        next(err);
    }
};

// 5. ELIMINAR UN POST (DELETE /posts/:id)
const deletePost = async (req, res, next) => {
    try {
        const deletedPost = await postService.deletePost(req.params.id);
        if (!deletedPost) return res.status(404).json({ error: 'Post not found' });

        res.json({ message: 'Post deleted successfully', data: deletedPost });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};