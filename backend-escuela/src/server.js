const app = require("./app");
const express = require("express"); // Añadido
const path = require("path");       // Añadido

const PORT = 3001;

// CONFIGURACIÓN PARA IMÁGENES
// Esto permite que al acceder a http://tu-ip:3001/uploads/foto.jpg se vea la imagen
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor backend corriendo en: http://localhost:${PORT}`);
  console.log(`📁 Carpeta de recursos estáticos: /uploads`);
});