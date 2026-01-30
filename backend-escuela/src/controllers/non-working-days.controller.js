const pool = require("../config/db");

// Obtener todos los días no laborables
const getNonWorkingDays = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM dias_no_laborables ORDER BY fecha");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener días no laborables:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agregar un día no laborable
const addNonWorkingDay = async (req, res) => {
  const { fecha, descripcion, tipo } = req.body;
  try {
    await pool.query(
      "INSERT INTO dias_no_laborables (fecha, descripcion, tipo) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion), tipo=VALUES(tipo)",
      [fecha, descripcion || '', tipo || 'festivo']
    );
    res.json({ message: "Día no laborable agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar día no laborable:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar un día no laborable
const removeNonWorkingDay = async (req, res) => {
  const { fecha } = req.params;
  try {
    await pool.query("DELETE FROM dias_no_laborables WHERE fecha = ?", [fecha]);
    res.json({ message: "Día no laborable eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar día no laborable:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { getNonWorkingDays, addNonWorkingDay, removeNonWorkingDay };