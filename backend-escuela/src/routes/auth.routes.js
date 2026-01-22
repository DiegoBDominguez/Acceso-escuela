const express = require('express');
const router = express.Router();
const { verificarCredenciales } = require('../controllers/auth.controller');

// Endpoint para iniciar sesión
router.post('/login', verificarCredenciales);

module.exports = router;