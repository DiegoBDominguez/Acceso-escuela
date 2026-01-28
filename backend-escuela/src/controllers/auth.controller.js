const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const verificarCredenciales = async (req, res) => {
    // 1. Limpieza de datos de entrada
    const matricula = req.body.matricula ? req.body.matricula.trim() : null;
    const password = req.body.password;

    console.log('📨 Login request recibido - Matrícula:', matricula); // LOG PARA DEPURACIÓN

    if (!matricula || !password) {
        console.log('❌ Campos vacíos - Matrícula:', matricula, 'Password:', password ? 'sí' : 'no');
        return res.status(400).json({ status: 400, mensaje: 'Matrícula y contraseña requeridas' });
    }

    try {
        // 2. Consulta a la base de datos
        // Traemos el rol tal cual está en la DB (ej. 'ENTRADA')
        const [usuarios] = await db.query(
            'SELECT id, matricula, password, rol, activo FROM usuarios WHERE matricula = ?', 
            [matricula]
        );
        
        console.log('🔍 Usuarios encontrados:', usuarios.length); // LOG PARA DEPURACIÓN
        
        const usuario = usuarios[0];

        // 3. Validaciones de existencia y estado
        if (!usuario) {
            console.log('❌ Usuario no encontrado con matrícula:', matricula);
            return res.status(401).json({ status: 401, mensaje: 'Matrícula o contraseña incorrecta' });
        }

        // Verifica si la cuenta está activa (columna 'activo' en tu DB)
        if (!usuario.activo || usuario.activo === 0) {
            console.log('❌ Usuario inactivo:', matricula);
            return res.status(401).json({ status: 401, mensaje: 'Usuario inactivo. Contacte al administrador.' });
        }

        // 4. Verificación de contraseña hash
        const contrasenaValida = await bcrypt.compare(password, usuario.password);
        
        if (!contrasenaValida) {
            console.log('❌ Contraseña incorrecta para matrícula:', matricula);
            return res.status(401).json({ status: 401, mensaje: 'Matrícula o contraseña incorrecta' });
        }

        // 5. Generación de Token JWT
        // Es vital incluir el ROL exacto en el payload para las rutas protegidas del frontend
        const token = jwt.sign(
            { 
                id: usuario.id, 
                matricula: usuario.matricula, 
                rol: usuario.rol // Enviamos 'ENTRADA', 'ADMIN' o 'ALUMNO'
            }, 
            process.env.JWT_SECRET || 'tu_secreto', // Usa variables de entorno preferiblemente
            { expiresIn: '4h' }
        );

        // 6. Respuesta exitosa
        console.log('✅ Login exitoso para matrícula:', matricula, 'Rol:', usuario.rol);
        // Enviamos el objeto usuario completo para que el Frontend sepa a dónde redirigir
        res.status(200).json({ 
            status: 200,
            mensaje: 'Login exitoso',
            token,
            usuario: { 
                id: usuario.id, 
                matricula: usuario.matricula, 
                rol: usuario.rol // Importante para la vista de entrada
            }
        });

    } catch (error) {
        console.error("❌ Error en Login:", error);
        res.status(500).json({ 
            status: 500, 
            mensaje: 'Error interno del servidor', 
            error: error.message 
        });
    }
};

module.exports = { verificarCredenciales };