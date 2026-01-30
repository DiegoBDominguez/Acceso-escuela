const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settings.controller");

const router = express.Router();

// Obtener configuraciones
router.get("/", getSettings);

// Actualizar configuraciones
router.put("/", updateSettings);

module.exports = router;