import Card from "../components/Card"

const Reports = () => {
  return (
    <Card>
      <h2>Reportes</h2>

      <p>Genera reportes personalizados de asistencia.</p>

      <div style={{ display: "flex", gap: "10px" }}>
        <button>Exportar Excel</button>
        <button>Exportar PDF</button>
      </div>
    </Card>
  )
}

export default Reports
