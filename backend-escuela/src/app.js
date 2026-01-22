const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Preparatoria funcionando 🚀");
});

// Rutas de autenticación
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Rutas de alumnos
const alumnosRoutes = require("./routes/alumnos.routes");
app.use("/api/alumnos", alumnosRoutes);

module.exports = app;
