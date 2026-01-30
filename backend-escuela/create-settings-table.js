const pool = require("./src/config/db");

async function createSettingsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS configuraciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hora_entrada TIME DEFAULT '08:00:00',
        tolerancia_retardo INT DEFAULT 10,
        hora_salida TIME DEFAULT '15:00:00',
        ciclo_escolar VARCHAR(20) DEFAULT '2024-2025',
        nombre_escuela VARCHAR(255) DEFAULT '',
        direccion VARCHAR(255) DEFAULT '',
        telefono VARCHAR(20) DEFAULT '',
        email VARCHAR(100) DEFAULT '',
        inicio_semestre DATE DEFAULT NULL,
        fin_semestre DATE DEFAULT NULL,
        UNIQUE KEY unique_settings (id)
      )
    `);
    console.log("✅ Tabla 'configuraciones' creada o ya existe");
  } catch (error) {
    console.error("❌ Error al crear tabla:", error);
  } finally {
    process.exit();
  }
}

createSettingsTable();