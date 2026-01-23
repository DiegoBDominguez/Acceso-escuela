const express = require('express');
const router = express.Router();
const { verificarCredenciales } = require('../controllers/auth.controller');

// Middleware para loguear todas las solicitudes
router.use((req, res, next) => {
    console.log(`\n🔵 [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    console.log('📍 Headers:', req.headers);
    console.log('📦 Body:', req.body);
    next();
});

// Endpoint para iniciar sesión
router.post('/login', verificarCredenciales);

module.exports = router;