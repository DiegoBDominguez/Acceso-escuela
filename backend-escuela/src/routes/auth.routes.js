const express = require('express');
const router = express.Router();
const { verificarCredenciales } = require('../controllers/auth.controller');

router.post('/login', verificarCredenciales);

module.exports = router;