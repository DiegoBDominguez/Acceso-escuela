const pool = require("./src/config/db");

async function checkSettings() {
  try {
    const [rows] = await pool.query("SELECT * FROM configuraciones");
    console.log("Configuraciones actuales:", rows);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}

checkSettings();