const db = require('../config/db');
const crypto = require('crypto');

// Obtener datos del perfil del alumno
const obtenerPerfil = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        
        console.log('🔍 Buscando perfil para usuario_id:', usuarioId);
        
        // Obtener datos del alumno junto con la matrícula de usuarios
        const [alumnos] = await db.query(
            `SELECT 
                a.id,
                a.nombre,
                a.apellido_paterno,
                a.apellido_materno,
                a.correo_institucional,
                a.grado,
                a.grupo,
                a.turno,
                u.matricula
            FROM alumnos a
            INNER JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.usuario_id = ?`,
            [usuarioId]
        );
        
        if (alumnos.length === 0) {
            return res.status(404).json({ 
                mensaje: 'Alumno no encontrado',
                data: null 
            });
        }
        
        const alumno = alumnos[0];
        console.log('✅ Perfil encontrado:', alumno);
        
        res.status(200).json({
            status: 200,
            data: {
                id: alumno.id,
                nombre: alumno.nombre,
                apellido_paterno: alumno.apellido_paterno,
                apellido_materno: alumno.apellido_materno,
                correo_institucional: alumno.correo_institucional,
                grado: alumno.grado,
                grupo: alumno.grupo,
                turno: alumno.turno,
                matricula: alumno.matricula
            }
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            mensaje: 'Error en el servidor', 
            error: error.message 
        });
    }
};

// Generar o obtener QR token del alumno
const obtenerQRToken = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        
        console.log('🔍 Obteniendo QR token para usuario_id:', usuarioId);
        
        // Primero obtener el ID del alumno
        const [alumnos] = await db.query(
            'SELECT id FROM alumnos WHERE usuario_id = ?',
            [usuarioId]
        );
        
        if (alumnos.length === 0) {
            return res.status(404).json({ 
                mensaje: 'Alumno no encontrado' 
            });
        }
        
        const alumnoId = alumnos[0].id;
        
        // Buscar token existente válido
        const [tokens] = await db.query(
            'SELECT token, expira_en FROM qr_tokens WHERE alumno_id = ? AND expira_en > NOW()',
            [alumnoId]
        );
        
        let token = null;
        
        if (tokens.length > 0) {
            token = tokens[0].token;
            console.log('✅ Token existente encontrado');
        } else {
            // Generar nuevo token único
            token = crypto.randomBytes(32).toString('hex');
            const expiraEn = new Date();
            expiraEn.setDate(expiraEn.getDate() + 365); // 1 año de validez
            
            await db.query(
                'INSERT INTO qr_tokens (alumno_id, token, expira_en) VALUES (?, ?, ?)',
                [alumnoId, token, expiraEn]
            );
            console.log('✅ Nuevo token generado:', token);
        }
        
        res.status(200).json({
            status: 200,
            token: token,
            mensaje: 'Token QR generado exitosamente'
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            mensaje: 'Error en el servidor', 
            error: error.message 
        });
    }
};

module.exports = { obtenerPerfil, obtenerQRToken };
