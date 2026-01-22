const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // XAMPP normalmente vacío
  database: "acceso_preparatoria",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
