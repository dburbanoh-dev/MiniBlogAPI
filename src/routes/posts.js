// src/routes/posts.js
const { Router } = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/postController');

const router = Router();

// Validación para el parámetro ID en rutas individuales
const idParam = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer');

// Reglas de validación al CREAR un Post
const createRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('title is required')
        .isLength({ min: 3, max: 100 }).withMessage('title must be 3-100 characters'),

    body('body')
        .trim()
        .notEmpty().withMessage('body content is required'),

    body('published')
        .optional()
        .isBoolean().withMessage('published must be a boolean value (true or false)'),

    body('user_id')
        .notEmpty().withMessage('user_id is required')
        .isInt({ min: 1 }).withMessage('user_id must be a valid user ID integer')
];

// Reglas de validación al ACTUALIZAR un Post (PATCH/PUT)
const updateRules = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('title must be 3-100 characters'),

    body('body')
        .optional()
        .trim()
        .notEmpty().withMessage('body cannot be empty if provided'),

    body('published')
        .optional()
        .isBoolean().withMessage('published must be a boolean value'),

    body('user_id')
        .optional()
        .isInt({ min: 1 }).withMessage('user_id must be a valid user ID integer')
];

// Definición de los Endpoints mapeados al controlador de posts
router.get('/', ctrl.getPosts);
router.get('/:id', idParam, ctrl.getPostById);
router.post('/', createRules, ctrl.createPost);
router.patch('/:id', idParam, updateRules, ctrl.updatePost);
router.delete('/:id', idParam, ctrl.deletePost);

module.exports = router;