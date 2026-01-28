const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const alumnosController = require('../controllers/alumnos.controller');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });

router.post('/registro', upload.single('foto'), alumnosController.registrarAlumno);
router.get('/lista', alumnosController.obtenerAlumnos);
router.get('/perfil/:usuarioId', alumnosController.obtenerPerfil);
router.get('/qr/:usuarioId', alumnosController.obtenerQRToken);
router.put('/editar/:id', alumnosController.actualizarAlumno);
router.delete('/eliminar/:id', alumnosController.eliminarAlumno);

module.exports = router;