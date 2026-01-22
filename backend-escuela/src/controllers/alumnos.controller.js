const db = require('../config/db');

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

module.exports = { obtenerPerfil };
