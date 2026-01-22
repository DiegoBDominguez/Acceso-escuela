const express = require('express');
const router = express.Router();
const { obtenerPerfil } = require('../controllers/alumnos.controller');

// Endpoint para obtener el perfil del alumno
router.get('/perfil/:usuarioId', obtenerPerfil);

module.exports = router;
