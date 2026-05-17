const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const sampleStudents = [
  {
    matricula: 'STUD001',
    nombre: 'Pablo',
    apellido_paterno: 'García',
    apellido_materno: 'López',
    correo: 'pablo.garcia@escuela.edu.mx',
    grado: 1,
    grupo: 'A',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '07:55:00'
  },
  {
    matricula: 'STUD002',
    nombre: 'Sofía',
    apellido_paterno: 'Morales',
    apellido_materno: 'Pérez',
    correo: 'sofia.morales@escuela.edu.mx',
    grado: 1,
    grupo: 'A',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '08:05:00'
  },
  {
    matricula: 'STUD003',
    nombre: 'Luis',
    apellido_paterno: 'Hernández',
    apellido_materno: 'Sánchez',
    correo: 'luis.hernandez@escuela.edu.mx',
    grado: 2,
    grupo: 'B',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'retardo',
    horaEntradaHoy: '08:25:00'
  },
  {
    matricula: 'STUD004',
    nombre: 'Ana',
    apellido_paterno: 'Ramírez',
    apellido_materno: 'Torres',
    correo: 'ana.ramirez@escuela.edu.mx',
    grado: 3,
    grupo: 'A',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'falta',
    horaEntradaHoy: null
  },
  {
    matricula: 'STUD005',
    nombre: 'Carla',
    apellido_paterno: 'Torres',
    apellido_materno: 'Gómez',
    correo: 'carla.torres@escuela.edu.mx',
    grado: 3,
    grupo: 'B',
    turno: 'VESPERTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '13:05:00'
  },
  {
    matricula: 'STUD006',
    nombre: 'Marina',
    apellido_paterno: 'Rojas',
    apellido_materno: 'Castro',
    correo: 'marina.rojas@escuela.edu.mx',
    grado: 2,
    grupo: 'A',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '07:45:00'
  },
  {
    matricula: 'STUD007',
    nombre: 'Diego',
    apellido_paterno: 'Fuentes',
    apellido_materno: 'Reyes',
    correo: 'diego.fuentes@escuela.edu.mx',
    grado: 1,
    grupo: 'B',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'retardo',
    horaEntradaHoy: '08:20:00'
  },
  {
    matricula: 'STUD008',
    nombre: 'Valeria',
    apellido_paterno: 'Méndez',
    apellido_materno: 'Villanueva',
    correo: 'valeria.mendez@escuela.edu.mx',
    grado: 2,
    grupo: 'B',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'falta',
    horaEntradaHoy: null
  },
  {
    matricula: 'STUD009',
    nombre: 'César',
    apellido_paterno: 'Álvarez',
    apellido_materno: 'Núñez',
    correo: 'cesar.alvarez@escuela.edu.mx',
    grado: 3,
    grupo: 'A',
    turno: 'VESPERTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '13:10:00'
  },
  {
    matricula: 'STUD010',
    nombre: 'Fernanda',
    apellido_paterno: 'Soto',
    apellido_materno: 'Pineda',
    correo: 'fernanda.soto@escuela.edu.mx',
    grado: 3,
    grupo: 'B',
    turno: 'VESPERTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '13:00:00'
  },
  {
    matricula: 'STUD011',
    nombre: 'Raúl',
    apellido_paterno: 'Vega',
    apellido_materno: 'Juárez',
    correo: 'raul.vega@escuela.edu.mx',
    grado: 1,
    grupo: 'A',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'retardo',
    horaEntradaHoy: '08:15:00'
  },
  {
    matricula: 'STUD012',
    nombre: 'Lorena',
    apellido_paterno: 'Camacho',
    apellido_materno: 'Ruiz',
    correo: 'lorena.camacho@escuela.edu.mx',
    grado: 2,
    grupo: 'A',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '07:50:00'
  },
  {
    matricula: 'STUD013',
    nombre: 'Raquel',
    apellido_paterno: 'Ortega',
    apellido_materno: 'Molina',
    correo: 'raquel.ortega@escuela.edu.mx',
    grado: 2,
    grupo: 'B',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'falta',
    horaEntradaHoy: null
  },
  {
    matricula: 'STUD014',
    nombre: 'Hugo',
    apellido_paterno: 'Luna',
    apellido_materno: 'Salazar',
    correo: 'hugo.luna@escuela.edu.mx',
    grado: 3,
    grupo: 'B',
    turno: 'VESPERTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '13:20:00'
  },
  {
    matricula: 'STUD015',
    nombre: 'Yolanda',
    apellido_paterno: 'Sánchez',
    apellido_materno: 'Mejía',
    correo: 'yolanda.sanchez@escuela.edu.mx',
    grado: 1,
    grupo: 'B',
    turno: 'MATUTINO',
    password: 'alumno123',
    estadoHoy: 'presente',
    horaEntradaHoy: '07:57:00'
  }
];

async function seedSampleData() {
  try {
    console.log('🔄 Limpiando datos de prueba anteriores...');
    await db.query(`DELETE a FROM asistencias a
      INNER JOIN usuarios u ON a.usuario_id = u.id
      WHERE u.matricula LIKE 'STUD%'`
    );
    await db.query(`DELETE FROM alumnos
      WHERE usuario_id IN (SELECT id FROM usuarios WHERE matricula LIKE 'STUD%')`
    );
    await db.query("DELETE FROM usuarios WHERE matricula LIKE 'STUD%'");

    console.log('✅ Datos de prueba anteriores eliminados');

    const insertedStudents = [];

    for (const student of sampleStudents) {
      const hashedPassword = await bcrypt.hash(student.password, 10);

      const [userResult] = await db.query(
        `INSERT INTO usuarios (matricula, password, rol, activo)
         VALUES (?, ?, 'ALUMNO', 1)`,
        [student.matricula, hashedPassword]
      );

      const usuarioId = userResult.insertId;

      const [alumnoResult] = await db.query(
        `INSERT INTO alumnos (usuario_id, matricula, nombre, apellido_paterno, apellido_materno, correo_institucional, grado, grupo, turno)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usuarioId,
          student.matricula,
          student.nombre,
          student.apellido_paterno,
          student.apellido_materno,
          student.correo,
          student.grado,
          student.grupo,
          student.turno
        ]
      );

      insertedStudents.push({
        ...student,
        usuarioId,
        alumnoId: alumnoResult.insertId
      });
    }

    console.log(`✅ Insertados ${insertedStudents.length} alumnos de prueba`);

    console.log('🔢 Insertando asistencias de hoy...');

    for (const student of insertedStudents) {
      await db.query(
        `INSERT INTO asistencias (alumno_id, usuario_id, fecha, hora_entrada, estado)
         VALUES (?, ?, CURDATE(), ?, ?)`,
        [student.alumnoId, student.usuarioId, student.horaEntradaHoy, student.estadoHoy]
      );
    }

    console.log('✅ Asistencias de hoy insertadas');

    const [rows] = await db.query(`
      SELECT a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, a.grado, a.grupo, a.turno, u.activo
      FROM alumnos a
      INNER JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.matricula LIKE 'STUD%'
      ORDER BY a.id
    `);

    console.log('\n📋 Alumnos insertados:');
    console.table(rows);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error.message);
    process.exit(1);
  }
}

seedSampleData();
