const express = require('express');
const router = express.Router();
const { registrarAsistencia, obtenerAsistencias, obtenerTodasAsistencias, obtenerEstadisticasDashboard, obtenerAsistenciasSemanales } = require('../controllers/asistencias.controller');

// Endpoint para registrar asistencia por QR
router.post('/registrar', registrarAsistencia);

// Endpoint para obtener asistencias del alumno
router.get('/mis-asistencias/:usuarioId', obtenerAsistencias);

// Endpoint para obtener asistencias semanales del alumno
router.get('/mis-asistencias-semanales/:usuarioId', obtenerAsistenciasSemanales);

// Endpoint para obtener todas las asistencias (admin) con filtros
router.get('/admin', obtenerTodasAsistencias);

// Endpoint para obtener estadísticas del dashboard
router.get('/dashboard-stats', obtenerEstadisticasDashboard);

module.exports = router;
