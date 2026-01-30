const pool = require("../config/db");

// Obtener configuraciones
const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM configuraciones LIMIT 1");
    if (rows.length === 0) {
      return res.json({
        hora_entrada: "08:00",
        tolerancia_retardo: 10,
        hora_salida: "15:00",
        ciclo_escolar: "2024-2025",
        nombre_escuela: "Preparatoria Ejemplo",
        direccion: "",
        telefono: "",
        email: "",
        inicio_semestre: "",
        fin_semestre: ""
      });
    }
    const settings = rows[0];
    // Formatear fechas para inputs HTML (yyyy-MM-dd)
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };
    settings.inicio_semestre = formatDate(settings.inicio_semestre);
    settings.fin_semestre = formatDate(settings.fin_semestre);
    res.json(settings);
  } catch (error) {
    console.error("Error al obtener configuraciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar configuraciones
const updateSettings = async (req, res) => {
  const { hora_entrada, tolerancia_retardo, hora_salida, ciclo_escolar, nombre_escuela, direccion, telefono, email, inicio_semestre, fin_semestre } = req.body;
  try {
    // Primero intentar actualizar la fila existente
    const [updateResult] = await pool.query(
      "UPDATE configuraciones SET hora_entrada=?, tolerancia_retardo=?, hora_salida=?, ciclo_escolar=?, nombre_escuela=?, direccion=?, telefono=?, email=?, inicio_semestre=?, fin_semestre=? WHERE id=1",
      [hora_entrada, tolerancia_retardo, hora_salida, ciclo_escolar, nombre_escuela, direccion, telefono, email, inicio_semestre, fin_semestre]
    );

    // Si no se actualizó ninguna fila (no existe), insertar nueva
    if (updateResult.affectedRows === 0) {
      await pool.query(
        "INSERT INTO configuraciones (hora_entrada, tolerancia_retardo, hora_salida, ciclo_escolar, nombre_escuela, direccion, telefono, email, inicio_semestre, fin_semestre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [hora_entrada, tolerancia_retardo, hora_salida, ciclo_escolar, nombre_escuela, direccion, telefono, email, inicio_semestre, fin_semestre]
      );
    }

    res.json({ message: "Configuraciones actualizadas correctamente" });
  } catch (error) {
    console.error("Error al actualizar configuraciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { getSettings, updateSettings };