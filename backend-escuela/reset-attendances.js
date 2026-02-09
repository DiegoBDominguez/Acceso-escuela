const pool = require("./src/config/db");

async function resetAttendances() {
  try {
    await pool.query("DELETE FROM asistencias");
    console.log("✅ Todas las asistencias han sido eliminadas");
  } catch (error) {
    console.error("❌ Error al eliminar asistencias:", error);
  } finally {
    process.exit();
  }
}

resetAttendances();