import axios from "axios"
import { useState } from "react"
import { API_ENDPOINTS } from "../config/api"
import "./Login.css"

const Login = () => {
  const [matricula, setMatricula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showHelp, setShowHelp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Botón presionado')

    if (!matricula || !password) {
      setError("Por favor completa todos los campos")
      return
    }

    setLoading(true)
    console.log('📤 Enviando solicitud con:', { matricula, password })

    try {
      const respuesta = await axios.post(API_ENDPOINTS.AUTH_LOGIN, { 
        matricula: matricula.trim(), 
        password: password.trim() 
      })

      console.log('✅ Respuesta del servidor:', respuesta.status, respuesta.data)

      if (respuesta.status === 200 && respuesta.data.token) {
        localStorage.setItem('token', respuesta.data.token)
        localStorage.setItem('usuario', JSON.stringify(respuesta.data))
        setError("")
        
        // Redirigir según el rol
        const rol = respuesta.data.rol
        console.log('🔐 Rol del usuario:', rol)
        console.log('📦 Datos completos:', respuesta.data)
        
        setTimeout(() => {
          if (rol === 'ALUMNO') {
            console.log('➡️ Redirigiendo a /students')
            window.location.href = '/students'
          } else if (rol === 'ADMIN') {
            console.log('➡️ Redirigiendo a /admin')
            window.location.href = '/admin'
          } else if (rol === 'ENTRADA') {
            console.log('➡️ Redirigiendo a /entrada')
            window.location.href = '/entrada'
          } else {
            console.error('❌ Rol desconocido:', rol)
          }
        }, 1000)
      }
    } catch (error: any) {
      console.error('❌ Error:', error)
      console.log('Response:', error.response?.data)
      setError("Matrícula o contraseña incorrecta")
      setMatricula("")
      setPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">

      {/* SECCIÓN INFORMATIVA */}
      <div className="login-info">
        <h1>Sistema de Control de Asistencia</h1>
        <h2>mediante Código QR</h2>

        <p>
          Plataforma web para el registro automático de entradas y salidas
          de alumnos de nivel bachillerato.
        </p>

        <ul>
          <li>✔ Registro seguro de asistencia</li>
        </ul>

        <span className="institution">
          Facultad de Ciencias de la Computación <br />
          Benemérita Universidad Autónoma de Puebla
        </span>
      </div>

      {/* FORMULARIO */}
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

          {error && <span className="error-text">{error}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Conectando..." : "Acceder"}
          </button>

          {/* ENLACE DE AYUDA */}
          <span
            className="login-footer"
            style={{ cursor: "pointer", marginTop: "10px" }}
            onClick={() => setShowHelp(true)}
          >
            ¿No puedes acceder a tu cuenta?
          </span>
        </form>
      </div>

      {/* MODAL */}
      {showHelp && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Información Importante</h3>

            <p>Para iniciar sesión al Sistema de Control de Asistencia realiza los siguientes pasos:</p>

            <ol>
              <li>Ingresa tu matrícula</li>
              <li>Coloca tu contraseña</li>
              <li>Da clic en el botón Acceder</li>
            </ol>

            <p className="modal-warning">
              <strong>¡Importante!</strong><br />
              Si no recuerdas la contraseña de acceso de tu cuenta 
              por favor contacta a la Secretaría Académica
              para solicitar el reinicio.
            </p>

            <button onClick={() => setShowHelp(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
