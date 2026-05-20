const { validationResult } = require('express-validator');
const userService = require('../services/userService');

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json({ data: users });
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ data: user });
    } catch (err) {
        next(err);
    }
};

const createUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const user = await userService.createUser(req.body);
        res.status(201).json({ data: user });
    } catch (err) {
        // Unique constraint violation
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username or email already in use' });
        }
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ data: user });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username or email already in use' });
        }
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const deleted = await userService.deleteUser(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };