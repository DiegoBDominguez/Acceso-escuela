const express = require("express");
const { getReports } = require("../controllers/reports.controller");

const router = express.Router();

// Obtener reportes
router.get("/", getReports);

module.exports = router;