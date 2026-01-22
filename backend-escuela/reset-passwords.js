const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function resetPasswords() {
  try {
    // Define las contraseñas que quieres usar (matrícula: contraseña)
    const passwords = {
      '202133193': '12345',         // Usuario de prueba
      '202133196': 'diego123',      // Diego Bustamante
      '123456789': 'juan123',       // Juan Pérez
      '201945872': 'maria123',      // María López
    };

    for (const [matricula, password] of Object.entries(passwords)) {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Actualizar en la BD
      await db.query('UPDATE usuarios SET password = ? WHERE matricula = ?', [hashedPassword, matricula]);
      
      console.log(`✅ ${matricula}: Contraseña actualizada a "${password}"`);
    }

    console.log('\n✨ Todas las contraseñas han sido actualizadas correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPasswords();
