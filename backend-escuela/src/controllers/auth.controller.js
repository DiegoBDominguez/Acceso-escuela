const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Controlador para verificar credenciales de inicio de sesión
const verificarCredenciales = async (req, res) => {
    console.log('📥 req.body completo:', req.body);
    
    const { matricula, password } = req.body || {};
    
    console.log('✅ matricula:', matricula);
    console.log('✅ password:', password);
    
    if (!matricula || !password) {
        return res.status(400).json({ mensaje: 'Matrícula y contraseña requeridas' });
    }
    
    try {
        console.log('🔍 Buscando usuario con matrícula:', matricula);
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula]);
        const usuario = usuarios[0];
        
        console.log('📋 Datos del usuario encontrado:', usuario);
        
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        if (!usuario.activo) {
            return res.status(401).json({ mensaje: 'Usuario inactivo' });
        }

        const contrasenaValida = await bcrypt.compare(password, usuario.password);
        console.log('🔐 Comparando contraseña:');
        console.log('   Input:', password);
        console.log('   Hash en BD:', usuario.password);
        console.log('   ¿Válida?:', contrasenaValida);
        
        if (!contrasenaValida) {
            console.log('❌ Contraseña inválida');
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ 
            id: usuario.id, 
            matricula: usuario.matricula, 
            rol: usuario.rol 
        }, 'tu_secreto', { expiresIn: '1h' });
        console.log('✅ Login exitoso para matrícula:', usuario.matricula, 'rol:', usuario.rol);
        res.status(200).json({ 
            status: 200,
            id: usuario.id,
            matricula: usuario.matricula,
            rol: usuario.rol,
            token,
            mensaje: 'Bienvenido' 
        });
    } catch (error) {
        console.error('❌ Error completo:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { verificarCredenciales };