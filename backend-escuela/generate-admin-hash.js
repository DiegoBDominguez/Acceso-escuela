const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function generarYActualizarAdmin() {
  try {
    const password = 'admin123';
    console.log('🔐 Generando hash para la contraseña: admin123');
    
    // Generar hash con 10 salt rounds (igual que el de la BD)
    const hashEncriptado = await bcrypt.hash(password, 10);
    
    console.log('✅ Hash generado:', hashEncriptado);
    
    // Actualizar el usuario admin con el nuevo hash
    await db.query(`
      UPDATE usuarios 
      SET password = ? 
      WHERE matricula = 'ADMIN001'
    `, [hashEncriptado]);
    
    console.log('✅ Usuario admin actualizado con el nuevo hash');
    
    // Verificar que el hash funciona correctamente
    const esValido = await bcrypt.compare(password, hashEncriptado);
    console.log('✅ Verificación: ¿admin123 coincide con el hash?', esValido);
    
    // Mostrar datos finales
    const [usuarios] = await db.query(`
      SELECT id, matricula, password, rol, activo FROM usuarios WHERE matricula = 'ADMIN001'
    `);
    
    console.log('\n📋 Datos finales del usuario admin:');
    console.log(JSON.stringify(usuarios[0], null, 2));
    
    console.log('\n✨ Ahora puedes hacer login con:');
    console.log('Matrícula: ADMIN001');
    console.log('Contraseña: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generarYActualizarAdmin();
