import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "./Login.css"

const Login = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showHelp, setShowHelp] = useState(false)

  // Matrícula alumno (9 números) o ID admin (ADMxxx)
  const validateUser = (value: string) => {
    const matriculaRegex = /^[0-9]{9}$/
    const adminRegex = /^ADM[0-9]{3,}$/i

    return {
      isMatricula: matriculaRegex.test(value),
      isAdmin: adminRegex.test(value)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const { isMatricula, isAdmin } = validateUser(user)

    if (!isMatricula && !isAdmin) {
      setError("Ingresa una matrícula válida o un ID de administrador.")
      return
    }

    if (password.length !== 8) {
      setError("La contraseña (NIP) debe contener exactamente 8 caracteres.")
      return
    }

    setError("")

    if (isMatricula) {
      navigate("/students")
    } else if (isAdmin) {
      navigate("/admin")
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

          <label>Matrícula / ID de Administrador</label>
          <input
            type="text"
            placeholder="Ej. 202400123 o ADM001"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className={error ? "input-error" : ""}
          />

          <label>Contraseña (NIP)</label>
          <input
            type="password"
            placeholder="8 caracteres"
            value={password}
            maxLength={8}
            onChange={(e) => setPassword(e.target.value)}
            className={error ? "input-error" : ""}
          />

          {error && <span className="error-text">{error}</span>}

          <button type="submit">
            Acceder
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

            <p>Para iniciar sesión al de Control de Asistencia realiza los siguientes pasos:</p>

            <ol>
              <li>Ingresa tu matrícula / ID </li>
              <li>Coloca tu Contraseña </li>
              <li>Da clic en el botón Acceder</li>
            </ol>

            <p className="modal-warning">
              <strong>¡Importante!</strong><br />
              Si no recuerdas la contraseña de acceso de tu cuenta 
              por favor contacta a la/el Secretaria(o)
              Académica(o) de la escula para solicitar el reinicio.
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
