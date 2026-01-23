const db = require('./src/config/db');

async function insertarAdmin() {
  try {
    console.log('Insertando usuario admin...');
    
    // Insertar el usuario admin con la contraseña ya encriptada en bcrypt
    await db.query(`
      INSERT INTO usuarios (matricula, password, rol, activo)
      VALUES (
        'ADMIN001',
        '$2b$10$1vYkqzQ6j8cQ3uGfXzQk7uJz4x5Z1gU0k0eQ4G9mZ3w6J8d0rKZ6K',
        'ADMIN',
        1
      )
    `);
    
    console.log('✅ Usuario admin insertado correctamente');
    
    // Verificar
    const [usuarios] = await db.query(`
      SELECT id, matricula, rol, activo FROM usuarios WHERE matricula = 'ADMIN001'
    `);
    
    console.log('\n📋 Datos del usuario admin:');
    console.log(JSON.stringify(usuarios, null, 2));
    
    console.log('\n🔓 Para probar el login, usa:');
    console.log('Matrícula: ADMIN001');
    console.log('Contraseña: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

insertarAdmin();
