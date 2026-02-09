const mysql = require("mysql2/promise");

async function createDatabase() {
  try {
    // Connect without database
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // XAMPP default
    });

    console.log('Connected to MySQL');

    // Create database if not exists
    await connection.execute('CREATE DATABASE IF NOT EXISTS acceso_preparatoria');
    console.log('Database acceso_preparatoria created or already exists');

    await connection.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

createDatabase();