import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        if (!matricula || !password) {
            setMensaje('Por favor, ingrese matrícula y contraseña.');
            console.log('❌ Campos vacíos - Matrícula o contraseña no ingresados');
            return;
        }
        console.log('📤 Intentando login con matrícula:', matricula);
        try {
            const respuesta = await axios.post('http://localhost:3001/api/auth/login', { matricula, password });
            
            // Solo si la respuesta es 200 (exitosa)
            if (respuesta.status === 200 && respuesta.data.token) {
                console.log('✅ Login exitoso:', respuesta.data);
                // Guardar token en localStorage
                localStorage.setItem('token', respuesta.data.token);
                localStorage.setItem('usuario', JSON.stringify(respuesta.data));
                setMensaje(`Bienvenido: ${respuesta.data.nombreCompleto}`);
                // Redirigir al dashboard
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (error) {
            console.log('❌ Error en login:', error.response?.data || error.message);
            console.log('❌ Status:', error.response?.status);
            setMensaje('Matrícula o contraseña incorrecta');
            // Limpiar los campos
            setMatricula('');
            setPassword('');
        }
    };

    return (
        <form onSubmit={manejarSubmit}>
            <input type="text" placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Iniciar Sesión</button>
            {mensaje && <p style={{ color: mensaje.includes('Bienvenido') ? 'green' : 'red' }}>{mensaje}</p>}
        </form>
    );
};

export default Login;