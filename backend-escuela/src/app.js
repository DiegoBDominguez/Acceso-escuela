const express = require("express");
const cors = require("cors");

const app = express();

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API Preparatoria funcionando 🚀");
});

// Rutas de autenticación
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Rutas de alumnos
const alumnosRoutes = require("./routes/alumnos.routes");
app.use("/api/alumnos", alumnosRoutes);

// Rutas de asistencias
const asistenciasRoutes = require("./routes/asistencias.routes");
app.use("/api/asistencias", asistenciasRoutes);

module.exports = app;
