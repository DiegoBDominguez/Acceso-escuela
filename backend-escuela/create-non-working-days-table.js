const db = require('./src/config/db');

async function createNonWorkingDaysTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS dias_no_laborables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL UNIQUE,
        descripcion VARCHAR(255),
        tipo ENUM('festivo', 'vacaciones', 'otro') DEFAULT 'festivo',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla dias_no_laborables creada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createNonWorkingDaysTable();