const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();

const SECRET = 'mi_secreto';

// Registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Usuario creado', user });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el login' });
    }
});

module.exports = router;
