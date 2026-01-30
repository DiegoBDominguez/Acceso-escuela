const app = require("./app");
const express = require("express"); // Añadido
const path = require("path");       // Añadido
const os = require("os");           // Para detectar IPs

const PORT = 3001;

// Función para obtener la IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

// CONFIGURACIÓN PARA IMÁGENES ya está en app.js
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Escuchar en todas las interfaces (0.0.0.0) para que funcione tanto localhost como IP
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor backend corriendo en:`);
  console.log(`   📍 Local: http://localhost:${PORT}`);
  console.log(`   🌐 Red:   http://${localIP}:${PORT}`);
  console.log(`📁 Carpeta de recursos estáticos: /uploads`);
});