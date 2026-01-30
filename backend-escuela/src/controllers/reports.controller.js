const pool = require("../config/db");

// Obtener reportes filtrados
const getReports = async (req, res) => {
  const { fromDate, toDate, userType, showPercentages, grade, group } = req.query;

  try {
    let query = "";
    let params = [];

    const dateFilter = fromDate && toDate ? "AND DATE(asis.fecha) BETWEEN ? AND ?" : "";
    const dateParams = fromDate && toDate ? [fromDate, toDate] : [];
    const gradeFilter = grade ? "AND a.grado = ?" : "";
    const groupFilter = group ? "AND a.grupo = ?" : "";
    const gradeGroupParams = [];
    if (grade) gradeGroupParams.push(grade);
    if (group) gradeGroupParams.push(group);

    // Reporte único que combina alumnos y personal según filtros
    if (userType === "alumno" || userType === "all") {
      query += `
        SELECT 'alumno' as tipo_usuario, a.usuario_id, a.nombre, a.apellido, a.matricula, a.grado, a.grupo,
               COUNT(CASE WHEN asis.estado = 'presente' THEN 1 END) as presentes,
               COUNT(CASE WHEN asis.estado = 'ausente' THEN 1 END) as ausentes,
               COUNT(CASE WHEN asis.estado = 'tarde' THEN 1 END) as tardes,
               COUNT(asis.id) as total_asistencias
        FROM alumnos a
        LEFT JOIN asistencias asis ON a.usuario_id = asis.usuario_id
        WHERE 1=1 ${dateFilter} ${gradeFilter} ${groupFilter}
        GROUP BY a.usuario_id, a.nombre, a.apellido, a.matricula, a.grado, a.grupo
      `;
      params.push(...dateParams, ...gradeGroupParams);
    }

    if (userType === "admin" || userType === "entrada" || userType === "all") {
      if (query) query += " UNION ALL ";
      const roleFilter = userType === "all" ? "" : `AND p.rol = '${userType}'`;
      query += `
        SELECT 'personal' as tipo_usuario, p.matricula as usuario_id, p.nombre, p.apellido, p.matricula, p.rol as grado, '' as grupo,
               COUNT(CASE WHEN asis.estado = 'presente' THEN 1 END) as presentes,
               COUNT(CASE WHEN asis.estado = 'ausente' THEN 1 END) as ausentes,
               COUNT(CASE WHEN asis.estado = 'tarde' THEN 1 END) as tardes,
               COUNT(asis.id) as total_asistencias
        FROM personal p
        LEFT JOIN asistencias asis ON p.matricula = asis.usuario_id
        WHERE 1=1 ${dateFilter} ${roleFilter}
        GROUP BY p.matricula, p.nombre, p.apellido, p.rol
      `;
      params.push(...dateParams);
    }

    query += " ORDER BY tipo_usuario, apellido, nombre";

    const [rows] = await pool.query(query, params);

    // Si se piden porcentajes, calcularlos
    if (showPercentages === 'true') {
      rows.forEach(row => {
        const total = row.total_asistencias || 1; // Evitar división por cero
        row.porcentaje_presentes = ((row.presentes / total) * 100).toFixed(2) + '%';
        row.porcentaje_ausentes = ((row.ausentes / total) * 100).toFixed(2) + '%';
        row.porcentaje_tardes = ((row.tardes / total) * 100).toFixed(2) + '%';
      });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { getReports };