import { useEffect, useState } from "react"
import Card from "../components/Card"
import { API_ENDPOINTS } from "../config/api"
import "./Attendance.css"

interface Asistencia {
  fecha: string
  hora_entrada: string
  hora_salida: string | null
}

const StudentAttendance = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const obtenerAsistencias = async () => {
      try {
        const usuarioData = localStorage.getItem("usuario")
        if (!usuarioData) {
          console.error("❌ Usuario no encontrado")
          setLoading(false)
          return
        }

        const usuario = JSON.parse(usuarioData)
        const usuarioId = usuario.id

        const response = await fetch(
          API_ENDPOINTS.ASISTENCIAS_MIS_ASISTENCIAS(usuarioId)
        )
        const data = await response.json()

        if (data.status === 200) {
          setAsistencias(data.data)
          console.log("✅ Asistencias obtenidas:", data.data)
        }
      } catch (error) {
        console.error("❌ Error obteniendo asistencias:", error)
      } finally {
        setLoading(false)
      }
    }

    obtenerAsistencias()
  }, [])

  if (loading) {
    return (
      <Card>
        <h3>Mi Asistencia</h3>
        <p>Cargando...</p>
      </Card>
    )
  }

  return (
    <Card>
      <h3>📊 Mi Asistencia</h3>

      {asistencias.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
          No hay registros de asistencia
        </p>
      ) : (
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((asistencia, index) => {
                const fechaFormato = new Date(asistencia.fecha).toLocaleDateString(
                  "es-MX"
                )
                const horaEntrada = asistencia.hora_entrada
                  ? asistencia.hora_entrada.substring(0, 5)
                  : "-"
                const horaSalida = asistencia.hora_salida
                  ? asistencia.hora_salida.substring(0, 5)
                  : "-"

                // Determinar estado: A TIEMPO o RETARDO
                const horaLimite = "07:00"
                const estado = horaEntrada <= horaLimite ? "✅ A TIEMPO" : "⚠️ RETARDO"

                return (
                  <tr key={index}>
                    <td>{fechaFormato}</td>
                    <td>
                      <strong>{horaEntrada}</strong>
                    </td>
                    <td>{horaSalida}</td>
                    <td className={horaEntrada <= horaLimite ? "estado-bien" : "estado-tarde"}>
                      {estado}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>📌 Última actualización: {new Date().toLocaleString("es-MX")}</p>
      </div>
    </Card>
  )
}

export default StudentAttendance
