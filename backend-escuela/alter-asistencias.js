const db = require('./src/config/db');

async function alterAsistenciasTable() {
  try {
    console.log('Alterando tabla asistencias...');

    // Agregar columnas faltantes
    await db.query(`
      ALTER TABLE asistencias
      ADD COLUMN IF NOT EXISTS usuario_id INT NOT NULL,
      ADD COLUMN IF NOT EXISTS estado ENUM('presente', 'retardo', 'falta') DEFAULT 'presente',
      ADD COLUMN IF NOT EXISTS fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    // Agregar foreign keys si no existen
    try {
      await db.query(`
        ALTER TABLE asistencias
        ADD CONSTRAINT fk_asistencias_alumno FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
        ADD CONSTRAINT fk_asistencias_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      `);
    } catch (e) {
      console.log('Foreign keys ya existen o error:', e.message);
    }

    console.log('✅ Columna estado agregada a asistencias');

    // Verificar estructura
    const [columns] = await db.query('DESCRIBE asistencias');
    console.log('Columnas de asistencias:', columns.map(c => c.Field));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

alterAsistenciasTable();