import Card from "../components/Card"
import "./Dashboard.css"

const Dashboard = () => {
  return (
    <>
      <h2>Dashboard</h2>

      <div className="grid">
        <Card>
          <h4>Total Alumnos</h4>
          <h1>320</h1>
        </Card>

        <Card>
          <h4>Asistencias Hoy</h4>
          <h1 style={{ color: "green" }}>295</h1>
        </Card>

        <Card>
          <h4>Retardos</h4>
          <h1 style={{ color: "#ca8a04" }}>18</h1>
        </Card>

        <Card>
          <h4>Faltas</h4>
          <h1 style={{ color: "#dc2626" }}>7</h1>
        </Card>
      </div>
    </>
  )
}

export default Dashboard
