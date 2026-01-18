import Card from "../components/Card"
import "./Attendance.css"

const Attendance = () => {
  return (
    <>
      <h2>Mi Asistencia</h2>

      {/* RESUMEN */}
      <div className="attendance-summary">
        <Card>
          <h4>Estado del día</h4>
          <span className="status present">Presente</span>
        </Card>

        <Card>
          <h4>Hora de entrada</h4>
          <p>07:05 AM</p>
        </Card>

        <Card>
          <h4>Hora de salida</h4>
          <p className="pending">Sin registrar</p>
        </Card>
      </div>

      {/* HISTORIAL */}
      <Card>
        <h3>Historial de Asistencias</h3>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10/01/2026</td>
                <td>07:02</td>
                <td>14:00</td>
                <td><span className="status present">Asistencia</span></td>
              </tr>
              <tr>
                <td>09/01/2026</td>
                <td>07:25</td>
                <td>14:00</td>
                <td><span className="status late">Retardo</span></td>
              </tr>
              <tr>
                <td>08/01/2026</td>
                <td>-</td>
                <td>-</td>
                <td><span className="status absent">Falta</span></td>
              </tr>
            </tbody>
          </table>
      </Card>
    </>
  )
}

export default Attendance
