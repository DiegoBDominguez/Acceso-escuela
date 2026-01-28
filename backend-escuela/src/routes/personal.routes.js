const express = require('express');
const router = express.Router(); // Corregido de .size() a .Router()
const personalController = require('../controllers/personal.controller');

// Ruta para registrar nuevo personal (POST)
router.post('/registrar', personalController.registrarPersonal);

// Ruta para obtener la lista de personal (GET)
router.get('/lista', personalController.obtenerPersonal);
router.put('/editar/:matricula', personalController.editarPersonal);
router.delete('/eliminar/:matricula', personalController.eliminarPersonal);

module.exports = router;