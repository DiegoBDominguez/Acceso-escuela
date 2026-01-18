import Card from "../components/Card"
import "./StudentQR.css"

const StudentQR = () => {
  return (
    <Card>
      <h3>Mi Código QR</h3>

      <p>
        Presenta este código al ingresar y salir de la institución.
      </p>

      <div className="qr-placeholder">
        <span>QR</span>
      </div>

      <p style={{ fontSize: "13px", color: "#555" }}>
        Código personal del alumno
      </p>
    </Card>
  )
}

export default StudentQR
