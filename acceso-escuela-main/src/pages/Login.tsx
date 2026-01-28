import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import "./Login.css";

const Login = () => {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (!matricula || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      // 1. Enviar solicitud al backend
      const respuesta = await axios.post(API_ENDPOINTS.AUTH_LOGIN, { 
        matricula: matricula.trim(), 
        password: password.trim() 
      });

      // 2. Verificar respuesta exitosa
      if (respuesta.status === 200 && respuesta.data.token) {
        const { token, usuario } = respuesta.data;

        // 3. Guardar datos en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario)); // Guardamos el objeto usuario
        
        const rol = usuario.rol; // Acceso correcto al rol
        
        // 4. Redirección basada en el rol
        setTimeout(() => {
          if (rol === 'ALUMNO') {
            window.location.href = '/students';
          } else if (rol === 'ADMIN') {
            window.location.href = '/admin';
          } else if (rol === 'ENTRADA') { // <--- Simplificado a ENTRADA que es lo que manda tu DB
            window.location.href = '/entrada';
          } else {
           setError("Rol de usuario no reconocido: " + rol);
       }
      }, 500);
      }
    } catch (error: any) {
      console.error('❌ Error de Login:', error.response?.data || error.message);
      // Mostrar mensaje específico del servidor si existe
      setError(error.response?.data?.mensaje || "Error al conectar con el servidor");
      setPassword(""); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-info">
        <h1>Sistema de Control de Asistencia</h1>
        <h2>mediante Código QR</h2>
        <p>Plataforma web para el registro automático de entradas y salidas de alumnos de nivel bachillerato.</p>
        <ul>
          <li>✔ Registro seguro de asistencia</li>
        </ul>
        <span className="institution">
          Facultad de Ciencias de la Computación <br />
          Benemérita Universidad Autónoma de Puebla
        </span>
      </div>

      <div className="login-form">
        <form onSubmit={handleLogin}>
          <h3>Inicio de Sesión</h3>
          <p>Ingresa tus credenciales institucionales</p>

          <label>Matrícula</label>
          <input
            type="text"
            placeholder="Ej. 202400123"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className={error ? "input-error" : ""}
            disabled={loading}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={error ? "input-error" : ""}
            disabled={loading}
          />

          {error && <span className="error-text" style={{color: 'red', display: 'block', marginBottom: '10px'}}>{error}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Acceder"}
          </button>

          <span
            className="login-footer"
            style={{ cursor: "pointer", marginTop: "20px", display: "block", textAlign: "center" }}
            onClick={() => setShowHelp(true)}
          >
            ¿No puedes acceder a tu cuenta?
          </span>
        </form>
      </div>

      {showHelp && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Información Importante</h3>
            <p>Para iniciar sesión realiza los siguientes pasos:</p>
            <ol>
              <li>Ingresa tu matrícula</li>
              <li>Coloca tu contraseña (por defecto es tu matrícula si es la primera vez)</li>
              <li>Da clic en el botón Acceder</li>
            </ol>
            <p className="modal-warning">
              <strong>¡Importante!</strong><br />
              Si no recuerdas tu contraseña, contacta a la Secretaría Académica para solicitar un reinicio.
            </p>
            <button onClick={() => setShowHelp(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;