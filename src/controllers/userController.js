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
        const { id } = req.params;

        // 1. Validar si el ID NO es un número entero válido
        if (!Number.isInteger(Number(id))) {
            return res.status(422).json({ error: 'El ID debe ser un número entero' });
        }

        // 2. Si es válido, continúa con tu lógica original usando la constante 'id'
        const user = await userService.getUserById(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

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
            return res.status(409).json({ error: 'El nombre de usuario o correo electrónico ya está en uso.El nombre de usuario o correo electrónico ya está en uso.' });
        }
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ data: user });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'El nombre de usuario o correo electrónico ya está en uso.' });
        }
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const deleted = await userService.deleteUser(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };