const db = require('../config/db');

// Registrar asistencia por escaneo de QR
const registrarAsistencia = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ mensaje: 'Token QR requerido' });
        }
        
        console.log('🔍 Validando token QR:', token);
        
        // Buscar el token en la BD
        const [qrTokens] = await db.query(
            `SELECT alumno_id FROM qr_tokens 
             WHERE token = ? AND expira_en > NOW()`,
            [token]
        );
        
        if (qrTokens.length === 0) {
            return res.status(401).json({ 
                mensaje: 'QR inválido o expirado' 
            });
        }
        
        const alumnoId = qrTokens[0].alumno_id;
        const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const ahora = new Date().toTimeString().split(' ')[0]; // HH:MM:SS
        
        console.log('📅 Fecha:', hoy, '⏰ Hora:', ahora);
        
        // Obtener datos del alumno
        const [alumnos] = await db.query(
            `SELECT a.id, a.nombre, a.apellido_paterno, a.turno
             FROM alumnos a WHERE a.id = ?`,
            [alumnoId]
        );
        
        if (alumnos.length === 0) {
            return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        }
        
        const alumno = alumnos[0];
        
        // Verificar si ya existe registro para hoy
        const [registrosHoy] = await db.query(
            `SELECT id, hora_entrada, hora_salida FROM asistencias 
             WHERE alumno_id = ? AND fecha = ?`,
            [alumnoId, hoy]
        );
        
        let resultado = {};
        let horaLimite = '07:00:00'; // Hora de entrada permitida
        
        if (registrosHoy.length === 0) {
            // Primera entrada del día
            const estado = ahora <= horaLimite ? 'A TIEMPO' : 'RETARDO';
            
            await db.query(
                `INSERT INTO asistencias (alumno_id, fecha, hora_entrada) 
                 VALUES (?, ?, ?)`,
                [alumnoId, hoy, ahora]
            );
            
            resultado = {
                tipo: 'ENTRADA',
                estado: estado,
                nombre: alumno.nombre,
                apellido: alumno.apellido_paterno,
                hora: ahora,
                fecha: hoy
            };
            
            console.log(`✅ Entrada registrada - ${estado} para ${alumno.nombre}`);
        } else {
            // Actualizar salida
            const registro = registrosHoy[0];
            
            if (!registro.hora_salida) {
                await db.query(
                    `UPDATE asistencias 
                     SET hora_salida = ? 
                     WHERE alumno_id = ? AND fecha = ?`,
                    [ahora, alumnoId, hoy]
                );
                
                resultado = {
                    tipo: 'SALIDA',
                    estado: 'REGISTRADO',
                    nombre: alumno.nombre,
                    apellido: alumno.apellido_paterno,
                    hora: ahora,
                    fecha: hoy,
                    hora_entrada: registro.hora_entrada,
                    hora_salida: ahora
                };
                
                console.log(`✅ Salida registrada para ${alumno.nombre}`);
            } else {
                return res.status(400).json({ 
                    mensaje: 'Ya tiene registrada entrada y salida para hoy' 
                });
            }
        }
        
        res.status(200).json({
            status: 200,
            datos: resultado,
            mensaje: 'Asistencia registrada exitosamente'
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            mensaje: 'Error en el servidor', 
            error: error.message 
        });
    }
};

// Obtener asistencias del alumno
const obtenerAsistencias = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        
        const [alumnos] = await db.query(
            'SELECT id FROM alumnos WHERE usuario_id = ?',
            [usuarioId]
        );
        
        if (alumnos.length === 0) {
            return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        }
        
        const alumnoId = alumnos[0].id;
        
        const [asistencias] = await db.query(
            `SELECT fecha, hora_entrada, hora_salida FROM asistencias 
             WHERE alumno_id = ? 
             ORDER BY fecha DESC`,
            [alumnoId]
        );
        
        res.status(200).json({
            status: 200,
            data: asistencias
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            mensaje: 'Error en el servidor', 
            error: error.message 
        });
    }
};

module.exports = { registrarAsistencia, obtenerAsistencias };
