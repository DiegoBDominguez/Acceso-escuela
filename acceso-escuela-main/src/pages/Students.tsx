import { useNavigate } from "react-router-dom"
import Card from "../components/Card"

const Students = () => {
  const navigate = useNavigate()

  return (
    <>
      <h2>Alumnos</h2>

      <Card>
        {/* BUSCADOR + BOTÓN */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            flexWrap: "wrap"
          }}
        >
          <input
            type="text"
            placeholder="Buscar por matrícula o nombre"
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <button
            className="btn secondary"
            onClick={() => navigate("/admin/students/new")}
          >
            + Registrar nuevo alumno
          </button>
        </div>

        {/* TABLA */}
        <div className="table-wrapper">
          <table width="100%">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
                <th>Grupo</th>
                <th>Turno</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>202400123</td>
                <td>Juan Pérez</td>
                <td>3°A</td>
                <td>Matutino</td>
                <td className="status present">Activo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default Students
