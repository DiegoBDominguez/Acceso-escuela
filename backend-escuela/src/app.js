const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Configuración de CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// =======================================================
// CAMBIO IMPORTANTE: Aumentar límite para recibir fotos Base64
// =======================================================
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("API Preparatoria funcionando 🚀");
});

// Rutas
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const alumnosRoutes = require("./routes/alumnos.routes");
app.use("/api/alumnos", alumnosRoutes);

const asistenciasRoutes = require("./routes/asistencias.routes");
app.use("/api/asistencias", asistenciasRoutes);

const personalRoutes = require("./routes/personal.routes");
app.use("/api/personal", personalRoutes);  

module.exports = app;