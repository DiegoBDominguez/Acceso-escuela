const db = require('./src/config/db');

async function limpiarEInsertar() {
  try {
    console.log('Limpiando datos de alumnos...');
    
    // Eliminar registros duplicados dejando solo uno
    await db.query('DELETE FROM alumnos WHERE usuario_id = 1');
    
    console.log('✅ Datos limpios');
    
    // Insertar un nuevo registro correcto
    await db.query(`
      INSERT INTO alumnos (usuario_id, nombre, apellido_paterno, apellido_materno, correo_institucional, grado, grupo, turno)
      VALUES (1, 'Diego', 'Bustamante', 'Perez', 'diego.bustamante@escuela.edu.mx', 3, 'A', 'MATUTINO')
    `);
    
    console.log('✅ Alumno insertado correctamente');
    
    // Verificar
    const [alumnos] = await db.query(`
      SELECT u.id, u.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, a.correo_institucional, a.grado, a.grupo, a.turno 
      FROM usuarios u 
      LEFT JOIN alumnos a ON u.id = a.usuario_id
    `);
    
    console.log('\n📋 Datos finales:');
    console.log(JSON.stringify(alumnos, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

limpiarEInsertar();
