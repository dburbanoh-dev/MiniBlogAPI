const { Router } = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/userController');

const router = Router();

const idParam = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer');

const createRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('username is required')
        .isLength({ min: 3, max: 50 }).withMessage('username must be 3-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('email must be valid')
        .normalizeEmail(),
];

const updateRules = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('username must be 3-50 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('email must be valid')
        .normalizeEmail(),
];

router.get('/', ctrl.getUsers);
router.get('/:id', idParam, ctrl.getUserById);
router.post('/', createRules, ctrl.createUser);
router.patch('/:id', idParam, updateRules, ctrl.updateUser);
router.delete('/:id', idParam, ctrl.deleteUser);

module.exports = router;