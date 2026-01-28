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
        // Incluimos foto_url para que aparezca en la tabla del frontend
        const [rows] = await db.query(`
            SELECT a.id, a.matricula, a.nombre, a.apellido_paterno, a.apellido_materno, 
                   a.grado, a.grupo, a.turno, a.foto_url, u.activo 
            FROM alumnos a
            INNER JOIN usuarios u ON a.usuario_id = u.id
            ORDER BY a.id DESC
        `);
        res.status(200).json({ status: 200, data: rows });
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