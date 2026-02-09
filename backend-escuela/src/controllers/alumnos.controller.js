const db = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// ==========================================
// 1. REGISTRAR NUEVO ALUMNO
// ==========================================
const registrarAlumno = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const { 
            nombre, apellido_paterno, apellido_materno, 
            matricula, correo_institucional, grado, grupo, turno,
            password, foto_url // Recibimos foto_url como Base64 desde el body
        } = req.body;

        const turnoNormalizado = turno ? turno.toUpperCase() : 'MATUTINO';

        // Preparar contraseña: si no se envía, se usa la matrícula por defecto
        const contraseñaAUsar = password || matricula;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(contraseñaAUsar, salt);

        // A. Insertar en USUARIOS
        const [userResult] = await connection.query(
            'INSERT INTO usuarios (matricula, password, rol, activo) VALUES (?, ?, ?, ?)',
            [matricula, passwordHash, 'ALUMNO', 1]
        );

        const usuarioId = userResult.insertId;

        // B. Insertar en ALUMNOS
        await connection.query(
            `INSERT INTO alumnos 
            (usuario_id, matricula, nombre, apellido_paterno, apellido_materno, correo_institucional, grado, grupo, turno, foto_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuarioId, matricula, nombre, apellido_paterno, apellido_materno, correo_institucional, grado, grupo, turnoNormalizado, foto_url]
        );

        await connection.commit();
        
        res.status(201).json({
            status: 201,
            mensaje: '✅ Alumno registrado exitosamente.',
            data: { matricula, nombre }
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("❌ Error en registro:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'La matrícula ya está registrada' });
        }
        res.status(500).json({ mensaje: 'Error al registrar alumno', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// ==========================================
// 2. OBTENER LISTA DE ALUMNOS (ADMIN)
// ==========================================
const obtenerAlumnos = async (req, res) => {
    try {
        // Obtener configuraciones para fechas de semestre
        const [settings] = await db.query('SELECT inicio_semestre, fin_semestre FROM configuraciones LIMIT 1');
        const inicioSemestre = settings[0]?.inicio_semestre;
        const finSemestre = settings[0]?.fin_semestre || '2026-12-31'; // Usar fin de año por defecto si no está configurado

        let attendanceData = [];

        if (inicioSemestre) {
            // Calcular días laborables del semestre (excluyendo fines de semana y días no laborables)
            const [workingDaysResult] = await db.query(`
                SELECT COUNT(*) as total_dias_laborables FROM (
                    SELECT DATE_FORMAT(dates.fecha, '%Y-%m-%d') as fecha
                    FROM (
                        SELECT DATE_ADD(?, INTERVAL seq DAY) as fecha
                        FROM (
                            SELECT 0 as seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
                            SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL 
                            SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL 
                            SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL 
                            SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL 
                            SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL 
                            SELECT 24 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL 
                            SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30 UNION ALL SELECT 31 UNION ALL 
                            SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35 UNION ALL 
                            SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL 
                            SELECT 40 UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL 
                            SELECT 44 UNION ALL SELECT 45 UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL 
                            SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50 UNION ALL SELECT 51 UNION ALL 
                            SELECT 52 UNION ALL SELECT 53 UNION ALL SELECT 54 UNION ALL SELECT 55 UNION ALL 
                            SELECT 56 UNION ALL SELECT 57 UNION ALL SELECT 58 UNION ALL SELECT 59 UNION ALL 
                            SELECT 60 UNION ALL SELECT 61 UNION ALL SELECT 62 UNION ALL SELECT 63 UNION ALL 
                            SELECT 64 UNION ALL SELECT 65 UNION ALL SELECT 66 UNION ALL SELECT 67 UNION ALL 
                            SELECT 68 UNION ALL SELECT 69 UNION ALL SELECT 70 UNION ALL SELECT 71 UNION ALL 
                            SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75 UNION ALL 
                            SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 78 UNION ALL SELECT 79 UNION ALL 
                            SELECT 80 UNION ALL SELECT 81 UNION ALL SELECT 82 UNION ALL SELECT 83 UNION ALL 
                            SELECT 84 UNION ALL SELECT 85 UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL 
                            SELECT 88 UNION ALL SELECT 89 UNION ALL SELECT 90 UNION ALL SELECT 91 UNION ALL 
                            SELECT 92 UNION ALL SELECT 93 UNION ALL SELECT 94 UNION ALL SELECT 95 UNION ALL 
                            SELECT 96 UNION ALL SELECT 97 UNION ALL SELECT 98 UNION ALL SELECT 99 UNION ALL 
                            SELECT 100 UNION ALL SELECT 101 UNION ALL SELECT 102 UNION ALL SELECT 103 UNION ALL 
                            SELECT 104 UNION ALL SELECT 105 UNION ALL SELECT 106 UNION ALL SELECT 107 UNION ALL 
                            SELECT 108 UNION ALL SELECT 109 UNION ALL SELECT 110 UNION ALL SELECT 111 UNION ALL 
                            SELECT 112 UNION ALL SELECT 113 UNION ALL SELECT 114 UNION ALL SELECT 115 UNION ALL 
                            SELECT 116 UNION ALL SELECT 117 UNION ALL SELECT 118 UNION ALL SELECT 119 UNION ALL 
                            SELECT 120 UNION ALL SELECT 121 UNION ALL SELECT 122 UNION ALL SELECT 123 UNION ALL 
                            SELECT 124 UNION ALL SELECT 125 UNION ALL SELECT 126 UNION ALL SELECT 127 UNION ALL 
                            SELECT 128 UNION ALL SELECT 129 UNION ALL SELECT 130 UNION ALL SELECT 131 UNION ALL 
                            SELECT 132 UNION ALL SELECT 133 UNION ALL SELECT 134 UNION ALL SELECT 135 UNION ALL 
                            SELECT 136 UNION ALL SELECT 137 UNION ALL SELECT 138 UNION ALL SELECT 139 UNION ALL 
                            SELECT 140 UNION ALL SELECT 141 UNION ALL SELECT 142 UNION ALL SELECT 143 UNION ALL 
                            SELECT 144 UNION ALL SELECT 145 UNION ALL SELECT 146 UNION ALL SELECT 147 UNION ALL 
                            SELECT 148 UNION ALL SELECT 149 UNION ALL SELECT 150 UNION ALL SELECT 151 UNION ALL 
                            SELECT 152 UNION ALL SELECT 153 UNION ALL SELECT 154 UNION ALL SELECT 155 UNION ALL 
                            SELECT 156 UNION ALL SELECT 157 UNION ALL SELECT 158 UNION ALL SELECT 159 UNION ALL 
                            SELECT 160 UNION ALL SELECT 161 UNION ALL SELECT 162 UNION ALL SELECT 163 UNION ALL 
                            SELECT 164 UNION ALL SELECT 165 UNION ALL SELECT 166 UNION ALL SELECT 167 UNION ALL 
                            SELECT 168 UNION ALL SELECT 169 UNION ALL SELECT 170 UNION ALL SELECT 171 UNION ALL 
                            SELECT 172 UNION ALL SELECT 173 UNION ALL SELECT 174 UNION ALL SELECT 175 UNION ALL 
                            SELECT 176 UNION ALL SELECT 177 UNION ALL SELECT 178 UNION ALL SELECT 179 UNION ALL 
                            SELECT 180 UNION ALL SELECT 181
                        ) seq
                        WHERE DATE_ADD(?, INTERVAL seq DAY) <= ?
                    ) dates
                    WHERE DAYOFWEEK(dates.fecha) NOT IN (1, 7)  -- Excluir domingos (1) y sábados (7)
                    AND dates.fecha NOT IN (SELECT fecha FROM dias_no_laborables)
                ) working_days
            `, [inicioSemestre, inicioSemestre, finSemestre]);

            const totalDiasLaborables = workingDaysResult[0]?.total_dias_laborables || 0;

            // Consulta con porcentaje de asistencia basado en días laborables
            const [rows] = await db.query(`
                SELECT a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, 
                       a.grado, a.grupo, a.turno, a.foto_url, u.activo,
                       ROUND(
                           IFNULL(
                               (COUNT(CASE WHEN asis.estado IN ('presente', 'retardo') THEN 1 END) / 
                                NULLIF(?, 0)) * 100, 
                               0
                           ), 1
                       ) as porcentaje_asistencia,
                       COUNT(CASE WHEN asis.estado IN ('presente', 'retardo') THEN 1 END) as dias_asistencias,
                       ? as total_dias_laborables
                FROM alumnos a
                INNER JOIN usuarios u ON a.usuario_id = u.id
                LEFT JOIN asistencias asis ON a.id = asis.alumno_id 
                    AND DATE(asis.fecha) BETWEEN ? AND ?
                    AND DAYOFWEEK(asis.fecha) NOT IN (1, 7)  -- Excluir fines de semana
                    AND DATE(asis.fecha) NOT IN (SELECT fecha FROM dias_no_laborables)
                GROUP BY a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, 
                         a.grado, a.grupo, a.turno, a.foto_url, u.activo
                ORDER BY a.id DESC
            `, [totalDiasLaborables, totalDiasLaborables, inicioSemestre, finSemestre]);

            attendanceData = rows;
        } else {
            // Si no hay fechas de semestre configuradas, usar la consulta original
            const [rows] = await db.query(`
                SELECT a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, 
                       a.grado, a.grupo, a.turno, a.foto_url, u.activo,
                       0 as porcentaje_asistencia,
                       0 as dias_presentes,
                       0 as total_dias_laborables
                FROM alumnos a
                INNER JOIN usuarios u ON a.usuario_id = u.id
                GROUP BY a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, 
                         a.grado, a.grupo, a.turno, a.foto_url, u.activo
                ORDER BY a.id DESC
            `);
            attendanceData = rows;
        }

        res.status(200).json({ status: 200, data: attendanceData });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener alumnos', error: error.message });
    }
};

// ==========================================
// 3. OBTENER PERFIL (VISTA ALUMNO)
// ==========================================
const obtenerPerfil = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        const [alumnos] = await db.query(
            'SELECT * FROM alumnos WHERE usuario_id = ?', [usuarioId]
        );
        
        if (alumnos.length === 0) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        
        res.status(200).json({ status: 200, data: alumnos[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// ==========================================
// 4. GENERAR/OBTENER QR TOKEN
// ==========================================
const obtenerQRToken = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        const [alumnos] = await db.query('SELECT id FROM alumnos WHERE usuario_id = ?', [usuarioId]);
        
        if (alumnos.length === 0) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        
        const alumnoId = alumnos[0].id;
        const [tokens] = await db.query(
            'SELECT token FROM qr_tokens WHERE alumno_id = ? AND expira_en > NOW() LIMIT 1', 
            [alumnoId]
        );
        
        if (tokens.length > 0) {
            return res.status(200).json({ status: 200, token: tokens[0].token });
        }

        const nuevoToken = crypto.randomBytes(32).toString('hex');
        const expiraEn = new Date();
        expiraEn.setFullYear(expiraEn.getFullYear() + 1);

        await db.query(
            'INSERT INTO qr_tokens (alumno_id, token, expira_en) VALUES (?, ?, ?)', 
            [alumnoId, nuevoToken, expiraEn]
        );
        
        res.status(200).json({ status: 200, token: nuevoToken });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// ==========================================
// 5. ACTUALIZAR ALUMNO
// ==========================================
const actualizarAlumno = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidoP, apellidoM, nuevaMatricula, grado, grupo, turno, activo, password, foto_url } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // IMPORTANTE: Asegúrate de que foto_url esté en el query
        await connection.query(
            `UPDATE alumnos SET nombre=?, apellido_paterno=?, apellido_materno=?, matricula=?, grado=?, grupo=?, turno=?, foto_url=? WHERE id=?`,
            [nombre, apellidoP, apellidoM, nuevaMatricula, grado, grupo, turno, foto_url, id]
        );

        const [user] = await connection.query('SELECT usuario_id FROM alumnos WHERE id = ?', [id]);
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            await connection.query('UPDATE usuarios SET matricula=?, activo=?, password=? WHERE id=?', [nuevaMatricula, activo, hash, user[0].usuario_id]);
        } else {
            await connection.query('UPDATE usuarios SET matricula=?, activo=? WHERE id=?', [nuevaMatricula, activo, user[0].usuario_id]);
        }

        await connection.commit();
        res.status(200).json({ status: 200, mensaje: 'Actualizado con éxito' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// ==========================================
// 6. ELIMINAR ALUMNO Y USUARIO
// ==========================================
const eliminarAlumno = async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Obtener el usuario_id antes de borrar al alumno
        const [alumno] = await connection.query('SELECT usuario_id FROM alumnos WHERE id = ?', [id]);
        if (alumno.length === 0) {
            return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        }
        const usuarioId = alumno[0].usuario_id;

        // 2. BORRAR REGISTROS DEPENDIENTES (Evita el error #1451)
        await connection.query('DELETE FROM qr_tokens WHERE alumno_id = ?', [id]);
        await connection.query('DELETE FROM asistencias WHERE alumno_id = ?', [id]);

        // 3. Ahora sí, borrar al alumno y su usuario
        await connection.query('DELETE FROM alumnos WHERE id = ?', [id]);
        await connection.query('DELETE FROM usuarios WHERE id = ?', [usuarioId]);

        await connection.commit();
        res.status(200).json({ status: 200, mensaje: '🗑️ Alumno y datos vinculados eliminados con éxito' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al eliminar:", error);
        res.status(500).json({ mensaje: '❌ Error al eliminar el alumno', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {  
    registrarAlumno, 
    obtenerAlumnos, 
    obtenerPerfil, 
    obtenerQRToken,
    actualizarAlumno,
    eliminarAlumno
};