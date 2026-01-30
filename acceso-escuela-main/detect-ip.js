// Script para detectar IP local automáticamente
// Ejecuta este script para ver tu IP actual
// Uso: node detect-ip.js

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const possibleIPs = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        possibleIPs.push(iface.address);
      }
    }
  }

  console.log('IPs locales detectadas:');
  possibleIPs.forEach((ip, index) => {
    console.log(`${index + 1}. ${ip}`);
  });

  if (possibleIPs.length > 0) {
    console.log(`\nIP más probable para usar en .env: ${possibleIPs[0]}`);
    console.log(`Actualiza VITE_API_URL=http://${possibleIPs[0]}:3001 en tu archivo .env`);
  } else {
    console.log('\nNo se encontraron IPs locales. Verifica tu conexión de red.');
  }

  return possibleIPs;
}

getLocalIP();