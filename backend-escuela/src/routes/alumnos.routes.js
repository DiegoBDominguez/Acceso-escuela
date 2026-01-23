const express = require('express');
const router = express.Router();
const { obtenerPerfil, obtenerQRToken } = require('../controllers/alumnos.controller');

// Endpoint para obtener el perfil del alumno
router.get('/perfil/:usuarioId', obtenerPerfil);

// Endpoint para obtener el token QR del alumno
router.get('/qr/:usuarioId', obtenerQRToken);

module.exports = router;
