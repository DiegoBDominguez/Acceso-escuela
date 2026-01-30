const db = require('./src/config/db');

async function insertDefaultSettings() {
  try {
    console.log('Insertando configuraciones por defecto...');

    // Calcular fechas
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const inOneMonth = new Date(today);
    inOneMonth.setMonth(today.getMonth() + 1);

    const inicioSemestre = lastWeek.toISOString().split('T')[0]; // YYYY-MM-DD
    const finSemestre = inOneMonth.toISOString().split('T')[0];

    console.log('Inicio semestre:', inicioSemestre);
    console.log('Fin semestre:', finSemestre);

    await db.query(`
      INSERT INTO configuraciones (hora_entrada, tolerancia_retardo, hora_salida, ciclo_escolar, nombre_escuela, inicio_semestre, fin_semestre)
      VALUES ('08:00:00', 10, '15:00:00', '2025-2026', 'Preparatoria Ejemplo', ?, ?)
      ON DUPLICATE KEY UPDATE
      inicio_semestre = VALUES(inicio_semestre),
      fin_semestre = VALUES(fin_semestre)
    `, [inicioSemestre, finSemestre]);

    console.log('✅ Configuraciones insertadas correctamente');

    // Verificar
    const [settings] = await db.query('SELECT * FROM configuraciones LIMIT 1');
    console.log('Configuraciones actuales:', settings[0]);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

insertDefaultSettings();