const db = require('./src/config/db');

async function createTables() {
  try {
    console.log('Creando tablas...');

    // Usuarios table
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('ALUMNO', 'PERSONAL', 'ADMIN') NOT NULL,
        activo TINYINT(1) DEFAULT 1,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla usuarios creada');

    // Personal table
    await db.query(`
      CREATE TABLE IF NOT EXISTS personal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellido_paterno VARCHAR(100) NOT NULL,
        apellido_materno VARCHAR(100),
        rol ENUM('PERSONAL', 'ADMIN') NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla personal creada');

    // Alumnos table
    await db.query(`
      CREATE TABLE IF NOT EXISTS alumnos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT UNIQUE NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellido_paterno VARCHAR(100) NOT NULL,
        apellido_materno VARCHAR(100),
        correo_institucional VARCHAR(150),
        grado INT,
        grupo VARCHAR(10),
        turno ENUM('MATUTINO', 'VESPERTINO') DEFAULT 'MATUTINO',
        foto_url TEXT,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla alumnos creada');

    // Asistencias table
    await db.query(`
      CREATE TABLE IF NOT EXISTS asistencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        alumno_id INT NOT NULL,
        usuario_id INT NOT NULL,
        fecha DATE NOT NULL,
        hora_entrada TIME,
        hora_salida TIME,
        estado ENUM('presente', 'retardo', 'falta') DEFAULT 'presente',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla asistencias creada');

    // QR Tokens table
    await db.query(`
      CREATE TABLE IF NOT EXISTS qr_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        alumno_id INT NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expira_en DATETIME NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla qr_tokens creada');

    // Configuraciones table (already exists from other script)
    await db.query(`
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
    console.log('✅ Tabla configuraciones creada');

    console.log('🎉 Todas las tablas han sido creadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear tablas:', error.message);
    process.exit(1);
  }
}

createTables();