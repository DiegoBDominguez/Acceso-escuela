const db = require('./src/config/db');

async function testAlumnosQuery() {
  try {
    console.log('Probando consulta de alumnos...');

    // Obtener configuraciones
    const [settings] = await db.query('SELECT inicio_semestre, fin_semestre FROM configuraciones LIMIT 1');
    console.log('Settings:', settings);

    const inicioSemestre = settings[0]?.inicio_semestre;
    const finSemestre = settings[0]?.fin_semestre;

    console.log('Inicio:', inicioSemestre, 'Fin:', finSemestre);

    let dateFilter = '';
    let dateParams = [];
    if (inicioSemestre && finSemestre) {
      dateFilter = 'AND DATE(asis.fecha) BETWEEN ? AND ?';
      dateParams = [inicioSemestre, finSemestre];
    }

    console.log('dateFilter:', dateFilter);
    console.log('dateParams:', dateParams);

    // Consulta
    const query = `
      SELECT a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno,
             a.grado, a.grupo, a.turno, a.foto_url, u.activo,
             ROUND(
               IFNULL(
                 (COUNT(CASE WHEN asis.estado = 'presente' THEN 1 END) /
                  NULLIF(COUNT(asis.id), 0)) * 100,
                 0
               ), 1
             ) as porcentaje_asistencia
      FROM alumnos a
      INNER JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN asistencias asis ON a.usuario_id = asis.usuario_id ${dateFilter}
      GROUP BY a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno,
               a.grado, a.grupo, a.turno, a.foto_url, u.activo
      ORDER BY a.id DESC
    `;

    console.log('Query:', query);

    const [rows] = await db.query(query, dateParams);
    console.log('Resultados:', rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testAlumnosQuery();