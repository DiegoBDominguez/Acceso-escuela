const db = require('../config/db');
const bcrypt = require('bcrypt'); // 1. IMPORTANTE: Necesitas bcrypt para el login

// --- OBTENER LISTA PARA LA TABLA ---
exports.obtenerPersonal = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT 
                matricula, 
                nombre, 
                apellido_paterno, 
                apellido_materno, 
                rol, 
                DATE_FORMAT(fecha_registro, '%d/%m/%Y %H:%i') AS fecha,
                CONCAT(nombre, ' ', apellido_paterno) AS nombreCompleto 
             FROM personal 
             ORDER BY fecha_registro DESC`
        );
        res.json(rows); 
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cargar lista" });
    }
};

// --- EDITAR PERSONAL ---
exports.editarPersonal = async (req, res) => {
    const { matricula: matriculaOriginal } = req.params;
    const { nombre, apellidoP, apellidoM, nuevoId, password, rol } = req.body;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Actualizar tabla personal
        await connection.execute(
            `UPDATE personal 
             SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, matricula = ?, rol = ? 
             WHERE matricula = ?`,
            [nombre, apellidoP, apellidoM, nuevoId, rol, matriculaOriginal]
        );

        // 2. Actualizar tabla usuarios (Matrícula y Rol)
        await connection.execute(
            `UPDATE usuarios SET matricula = ?, rol = ? WHERE matricula = ?`,
            [nuevoId, rol, matriculaOriginal]
        );

        // 3. ENCRIPTAR CONTRASEÑA NUEVA (Si se envió una)
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await connection.execute(
                `UPDATE usuarios SET password = ? WHERE matricula = ?`,
                [hashedPassword, nuevoId]
            );
        }

        await connection.commit();
        res.json({ status: 200, mensaje: "Actualizado con éxito" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error SQL:", error);
        const msg = error.errno === 1062 ? "La nueva matrícula ya existe" : "Error al editar";
        res.status(500).json({ mensaje: msg });
    } finally {
        if (connection) connection.release();
    }
};

// --- ELIMINAR PERSONAL ---
exports.eliminarPersonal = async (req, res) => {
    const { matricula } = req.params;
    try {
        // - Asegúrate de tener ON DELETE CASCADE en la BD
        const [result] = await db.execute('DELETE FROM usuarios WHERE matricula = ?', [matricula]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "No encontrado" });
        res.json({ status: 200, mensaje: "Eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar: " + error.message });
    }
};

// --- REGISTRAR PERSONAL (CORREGIDO CON BCRYPT) ---
exports.registrarPersonal = async (req, res) => {
    const { nombre, apellidoP, apellidoM, matricula, password, rol } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Encriptar contraseña (OBLIGATORIO para que el login funcione)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Insertar en usuarios (Aseguramos activo = 1)
        const [userResult] = await connection.execute(
            'INSERT INTO usuarios (matricula, password, rol, activo) VALUES (?, ?, ?, 1)',
            [matricula, hashedPassword, rol]
        );

        // 3. Insertar en personal vinculado al usuario_id
        await connection.execute(
            'INSERT INTO personal (usuario_id, nombre, apellido_paterno, apellido_materno, matricula, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [userResult.insertId, nombre, apellidoP, apellidoM, matricula, rol]
        );

        await connection.commit();
        res.status(201).json({ status: 201, mensaje: "Registrado con éxito" });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al registrar:", error);
        res.status(500).json({ mensaje: error.errno === 1062 ? "La matrícula ya existe" : "Error de servidor" });
    } finally {
        if (connection) connection.release();
    }
};