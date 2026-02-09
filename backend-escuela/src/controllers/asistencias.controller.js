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
        const hoy = new Date().getFullYear() + '-' + 
          String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
          String(new Date().getDate()).padStart(2, '0'); // Fecha local
        const ahora = new Date().toTimeString().split(' ')[0]; // HH:MM:SS
        
        console.log('📅 Fecha:', hoy, '⏰ Hora:', ahora);
        
        // Obtener datos del alumno
        const [alumnos] = await db.query(
            `SELECT a.id, a.usuario_id, a.nombre, a.apellido_paterno, a.turno
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
            const estado = ahora <= horaLimite ? 'presente' : 'retardo';
            
            await db.query(
                `INSERT INTO asistencias (alumno_id, usuario_id, fecha, hora_entrada, estado) 
                 VALUES (?, ?, ?, ?, ?)`,
                [alumnoId, alumno.usuario_id, hoy, ahora, estado]
            );
            
            resultado = {
                tipo: 'ENTRADA',
                estado: estado === 'presente' ? 'A TIEMPO' : 'RETARDO',
                nombre: alumno.nombre,
                apellido: alumno.apellido_paterno,
                hora: ahora,
                fecha: hoy
            };
            
            console.log(`✅ Entrada registrada - ${estado === 'presente' ? 'A TIEMPO' : 'RETARDO'} para ${alumno.nombre}`);
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

// Obtener todas las asistencias para admin con filtros
const obtenerTodasAsistencias = async (req, res) => {
    try {
        const { fecha, matricula, estado } = req.query;
        
        let whereConditions = [];
        let queryParams = [];
        
        // Filtro por fecha específica
        if (fecha) {
            whereConditions.push('DATE(a.fecha) = ?');
            queryParams.push(fecha);
        }
        
        // Filtro por matrícula
        if (matricula) {
            whereConditions.push('al.matricula LIKE ?');
            queryParams.push(`%${matricula}%`);
        }
        
        // Filtro por estado
        if (estado && estado !== 'todos') {
            whereConditions.push('a.estado = ?');
            queryParams.push(estado);
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        const [asistencias] = await db.query(`
            SELECT 
                a.id,
                al.matricula,
                CONCAT(al.nombre, ' ', al.apellido_paterno, ' ', al.apellido_materno) as nombre_completo,
                a.fecha,
                a.hora_entrada,
                a.hora_salida,
                a.estado
            FROM asistencias a
            INNER JOIN alumnos al ON a.alumno_id = al.id
            ${whereClause}
            ORDER BY a.fecha DESC, a.hora_entrada DESC
        `, queryParams);
        
        res.status(200).json({
            status: 200,
            data: asistencias
        });
    } catch (error) {
        console.error('❌ Error al obtener asistencias:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener asistencias', 
            error: error.message 
        });
    }
};

// Obtener estadísticas del dashboard para el día actual
const obtenerEstadisticasDashboard = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Obtener total de alumnos
        const [totalAlumnos] = await db.query('SELECT COUNT(*) as total FROM alumnos');

        // Obtener estadísticas de asistencias del día actual
        const [estadisticasHoy] = await db.query(`
            SELECT 
                COUNT(*) as total_registros,
                SUM(CASE WHEN estado = 'presente' THEN 1 ELSE 0 END) as presentes,
                SUM(CASE WHEN estado = 'retardo' THEN 1 ELSE 0 END) as retardos,
                SUM(CASE WHEN estado = 'falta' THEN 1 ELSE 0 END) as faltas
            FROM asistencias 
            WHERE DATE(fecha) = ?
        `, [hoy]);

        // Obtener distribución por grados
        const [distribucionGrados] = await db.query(`
            SELECT 
                COALESCE(a.grado, 'Sin grado') as grado,
                COUNT(*) as total_alumnos,
                SUM(CASE WHEN asis.estado = 'presente' THEN 1 ELSE 0 END) as presentes,
                SUM(CASE WHEN asis.estado = 'retardo' THEN 1 ELSE 0 END) as retardos,
                SUM(CASE WHEN asis.estado = 'falta' THEN 1 ELSE 0 END) as faltas
            FROM alumnos a
            LEFT JOIN asistencias asis ON a.id = asis.alumno_id AND DATE(asis.fecha) = ?
            GROUP BY a.grado
            ORDER BY a.grado
        `, [hoy]);

        const stats = estadisticasHoy[0];
        const total = totalAlumnos[0].total;

        res.status(200).json({
            status: 200,
            data: {
                total_alumnos: total,
                asistencias_hoy: {
                    presentes: stats.presentes || 0,
                    retardos: stats.retardos || 0,
                    faltas: stats.faltas || 0,
                    total_registros: stats.total_registros || 0
                },
                distribucion_grados: distribucionGrados,
                fecha_actual: hoy
            }
        });
    } catch (error) {
        console.error('❌ Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener estadísticas del dashboard', 
            error: error.message 
        });
    }
};

const obtenerAsistenciasSemanales = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        const { fecha } = req.query; // Fecha opcional para seleccionar semana

        console.log('🔍 Usuario ID:', usuarioId, 'Fecha:', fecha);

        // Obtener la fecha de inicio del semestre desde configuraciones
        const [config] = await db.query('SELECT inicio_semestre FROM configuraciones LIMIT 1');
        if (config.length === 0 || !config[0].inicio_semestre) {
            return res.status(400).json({ mensaje: 'Fecha de inicio del semestre no configurada' });
        }
        const inicioSemestre = new Date(config[0].inicio_semestre);
        if (isNaN(inicioSemestre.getTime())) {
            return res.status(400).json({ mensaje: 'Fecha de inicio del semestre inválida' });
        }
        const inicioSemestreStr = inicioSemestre.getFullYear() + '-' + 
          String(inicioSemestre.getMonth() + 1).padStart(2, '0') + '-' + 
          String(inicioSemestre.getDate()).padStart(2, '0');
        console.log('📅 Inicio semestre:', inicioSemestre, 'Str:', inicioSemestreStr);

        // Si no se proporciona fecha, usar la fecha actual
        const fechaBase = fecha ? new Date(fecha) : new Date();
        console.log('📅 Fecha base:', fechaBase);

        // Calcular días transcurridos desde el inicio del semestre
        const diasTranscurridos = Math.floor((fechaBase - inicioSemestre) / (1000 * 60 * 60 * 24));
        console.log('📊 Días transcurridos:', diasTranscurridos);

        // Calcular el número de semana (cada 5 días)
        const semanaActual = Math.floor(diasTranscurridos / 5);
        console.log('📊 Semana actual:', semanaActual);

        // Calcular inicio de la semana actual (basado en inicio_semestre)
        const inicioSemana = new Date(inicioSemestre);
        inicioSemana.setDate(inicioSemestre.getDate() + (semanaActual * 5));
        inicioSemana.setHours(0, 0, 0, 0);

        // Calcular fin de la semana (5 días después)
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 4);
        finSemana.setHours(23, 59, 59, 999);

        const inicioStr = inicioSemana.getFullYear() + '-' + 
          String(inicioSemana.getMonth() + 1).padStart(2, '0') + '-' + 
          String(inicioSemana.getDate()).padStart(2, '0');
        const finStr = finSemana.getFullYear() + '-' + 
          String(finSemana.getMonth() + 1).padStart(2, '0') + '-' + 
          String(finSemana.getDate()).padStart(2, '0');

        console.log('📅 Semana:', inicioStr, 'a', finStr);

        const [alumnos] = await db.query(
            'SELECT id FROM alumnos WHERE usuario_id = ?',
            [usuarioId]
        );

        if (alumnos.length === 0) {
            return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        }

        const alumnoId = alumnos[0].id;
        console.log('👤 Alumno ID:', alumnoId);

        // Obtener asistencias de la semana
        const [asistencias] = await db.query(
            `SELECT fecha, hora_entrada, hora_salida, estado FROM asistencias
             WHERE alumno_id = ? AND fecha BETWEEN ? AND ?
             ORDER BY fecha`,
            [alumnoId, inicioStr, finStr]
        );

        console.log('📋 Asistencias encontradas:', asistencias.length);

            // Crear array de días de la semana (lunes a viernes)
        const diasSemana = [];
        let diasHabilesSemana = 0; // Días que ya pasaron y están dentro del semestre
        for (let i = 0; i < 5; i++) {
            const fechaDia = new Date(inicioSemana);
            fechaDia.setDate(inicioSemana.getDate() + i);
            const fechaStr = fechaDia.getFullYear() + '-' + 
              String(fechaDia.getMonth() + 1).padStart(2, '0') + '-' + 
              String(fechaDia.getDate()).padStart(2, '0');

            // Buscar asistencia para este día
            const asistenciaDia = asistencias.find(a => a.fecha === fechaStr);

            // Verificar si el día ya pasó y está dentro del semestre
            const hoy = new Date();
            hoy.setHours(23, 59, 59, 999); // Fin del día actual
            const isDiaPasado = fechaDia <= hoy;
            const isDiaDentroSemestre = fechaDia >= inicioSemestre;

            if (isDiaPasado && isDiaDentroSemestre) {
                diasHabilesSemana++;
            }

            diasSemana.push({
                fecha: fechaStr,
                dia: fechaDia.toLocaleDateString('es-ES', { weekday: 'long' }),
                entrada: asistenciaDia ? asistenciaDia.hora_entrada : null,
                salida: asistenciaDia ? asistenciaDia.hora_salida : null,
                estado: asistenciaDia ? asistenciaDia.estado : null
            });
        }

        // Calcular estadísticas semanales
        const diasPresentesSemana = asistencias.filter(a => a.estado === 'presente').length;
        const diasTardesSemana = asistencias.filter(a => a.estado === 'retardo').length;
        const diasConAsistencia = asistencias.length;
        const diasAusentesSemana = diasHabilesSemana - diasConAsistencia;

        // Calcular estadísticas generales desde inicio de semestre
        const hoy = new Date();
        const hoyStr = hoy.getFullYear() + '-' + 
          String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
          String(hoy.getDate()).padStart(2, '0');
        const [asistenciasTotales] = await db.query(
            `SELECT COUNT(DISTINCT fecha) as total_asistencias FROM asistencias
             WHERE alumno_id = ? AND fecha BETWEEN ? AND ?`,
            [alumnoId, inicioSemestreStr, hoyStr]
        );
        const totalDiasDesdeInicio = Math.floor((hoy - inicioSemestre) / (1000 * 60 * 60 * 24)) + 1;
        const porcentajeAsistenciaGeneral = totalDiasDesdeInicio > 0 ? Math.round((asistenciasTotales[0].total_asistencias / totalDiasDesdeInicio) * 100) : 0;

        res.status(200).json({
            status: 200,
            data: {
                semana: {
                    inicio: inicioStr,
                    fin: finStr
                },
                dias: diasSemana,
                estadisticas: {
                    total_asistencias: diasConAsistencia,
                    total_faltas: diasAusentesSemana,
                    total_tardes: diasTardesSemana,
                    porcentaje_asistencia: porcentajeAsistenciaGeneral
                },
                inicio_semestre: inicioSemestreStr
            }
        });
    } catch (error) {
        console.error('❌ Error al obtener asistencias semanales:', error);
        res.status(500).json({
            mensaje: 'Error al obtener asistencias semanales',
            error: error.message
        });
    }
};

module.exports = { registrarAsistencia, obtenerAsistencias, obtenerTodasAsistencias, obtenerEstadisticasDashboard, obtenerAsistenciasSemanales };
