import Card from "../components/Card"

const AdminAttendance = () => {
  return (
    <>
      <h2>Control de Asistencias</h2>

      {/* FILTROS */}
      <Card>
        <h4>Filtros</h4>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input type="date" />
          <input type="text" placeholder="Matrícula" />
          <select>
            <option>Todos los estados</option>
            <option>Presente</option>
            <option>Retardo</option>
            <option>Falta</option>
          </select>
        </div>
      </Card>

      {/* TABLA */}
      <Card>
        <h3>Registro de Asistencias</h3>
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Alumno</th>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>202400123</td>
                <td>Juan Pérez</td>
                <td>10/01/2026</td>
                <td>07:05</td>
                <td>14:00</td>
                <td><span className="status present">Presente</span></td>
              </tr>

              <tr>
                <td>202400124</td>
                <td>María López</td>
                <td>10/01/2026</td>
                <td>07:25</td>
                <td>14:00</td>
                <td><span className="status late">Retardo</span></td>
              </tr>

              <tr>
                <td>202400125</td>
                <td>Carlos Ruiz</td>
                <td>10/01/2026</td>
                <td>-</td>
                <td>-</td>
                <td><span className="status absent">Falta</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default AdminAttendance
