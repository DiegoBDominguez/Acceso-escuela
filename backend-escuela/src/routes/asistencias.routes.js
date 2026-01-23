const express = require('express');
const router = express.Router();
const { registrarAsistencia, obtenerAsistencias } = require('../controllers/asistencias.controller');

// Endpoint para registrar asistencia por QR
router.post('/registrar', registrarAsistencia);

// Endpoint para obtener asistencias del alumno
router.get('/mis-asistencias/:usuarioId', obtenerAsistencias);

module.exports = router;
