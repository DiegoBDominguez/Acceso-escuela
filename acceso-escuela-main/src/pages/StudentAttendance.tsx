import { useEffect, useState } from "react"
import Card from "../components/Card"
import { API_ENDPOINTS } from "../config/api"
import "./Attendance.css"

interface Asistencia {
  fecha: string
  hora_entrada: string
  hora_salida: string | null
}

interface DiaSemana {
  fecha: string
  dia: string
  entrada: string | null
  salida: string | null
  presente: boolean
}

interface EstadisticasSemana {
  total_asistencias: number
  total_faltas: number
  porcentaje_asistencia: number
}

interface DatosSemana {
  semana: {
    inicio: string
    fin: string
  }
  dias: DiaSemana[]
  estadisticas: EstadisticasSemana
}

const StudentAttendance = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [datosSemana, setDatosSemana] = useState<DatosSemana | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingSemana, setLoadingSemana] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())

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

  // Función para obtener asistencias semanales
  const obtenerAsistenciasSemanales = async (fecha: Date) => {
    setLoadingSemana(true)
    try {
      const usuarioData = localStorage.getItem("usuario")
      if (!usuarioData) {
        console.error("❌ Usuario no encontrado")
        return
      }

      const usuario = JSON.parse(usuarioData)
      const usuarioId = usuario.id

      const fechaStr = fecha.toISOString().split('T')[0]
      const response = await fetch(
        `${API_ENDPOINTS.ASISTENCIAS_MIS_ASISTENCIAS_SEMANALES(usuarioId)}?fecha=${fechaStr}`
      )
      const data = await response.json()

      if (data.status === 200) {
        setDatosSemana(data.data)
        console.log("✅ Asistencias semanales obtenidas:", data.data)
      }
    } catch (error) {
      console.error("❌ Error obteniendo asistencias semanales:", error)
    } finally {
      setLoadingSemana(false)
    }
  }

  // Cargar semana actual al montar el componente
  useEffect(() => {
    obtenerAsistenciasSemanales(fechaSeleccionada)
  }, [fechaSeleccionada])

  // Funciones para navegar entre semanas
  const semanaAnterior = () => {
    const nuevaFecha = new Date(fechaSeleccionada)
    nuevaFecha.setDate(fechaSeleccionada.getDate() - 7)
    setFechaSeleccionada(nuevaFecha)
  }

  const semanaSiguiente = () => {
    const nuevaFecha = new Date(fechaSeleccionada)
    nuevaFecha.setDate(fechaSeleccionada.getDate() + 7)
    setFechaSeleccionada(nuevaFecha)
  }

  const semanaActual = () => {
    setFechaSeleccionada(new Date())
  }

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

      {/* Vista Semanal */}
      <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h4 style={{ margin: 0, color: "#1f2937" }}>📅 Semana Actual</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={semanaAnterior}
              style={{
                padding: "6px 12px",
                backgroundColor: "#e5e7eb",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={semanaActual}
              style={{
                padding: "6px 12px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Hoy
            </button>
            <button
              onClick={semanaSiguiente}
              style={{
                padding: "6px 12px",
                backgroundColor: "#e5e7eb",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>

        {loadingSemana ? (
          <p>Cargando semana...</p>
        ) : datosSemana ? (
          <>
            {/* Días de la semana */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "20px" }}>
              {datosSemana.dias.map((dia, index) => (
                <div
                  key={index}
                  style={{
                    padding: "15px",
                    backgroundColor: dia.presente ? "#dcfce7" : "#fef2f2",
                    border: `2px solid ${dia.presente ? "#16a34a" : "#dc2626"}`,
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>
                    {dia.dia.charAt(0).toUpperCase() + dia.dia.slice(1)}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                    {new Date(dia.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                  </div>
                  {dia.presente ? (
                    <>
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#16a34a", marginBottom: "4px" }}>
                        ✅ Presente
                      </div>
                      <div style={{ fontSize: "12px", color: "#374151" }}>
                        <div>Entrada: {dia.entrada ? dia.entrada.substring(0, 5) : '-'}</div>
                        <div>Salida: {dia.salida ? dia.salida.substring(0, 5) : '-'}</div>
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#dc2626" }}>
                      ❌ Ausente
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Estadísticas */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a" }}>
                  {datosSemana.estadisticas.total_asistencias}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Asistencias</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>
                  {datosSemana.estadisticas.total_faltas}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Faltas</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                  {datosSemana.estadisticas.porcentaje_asistencia}%
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Asistencia</div>
              </div>
            </div>
          </>
        ) : (
          <p>Error al cargar los datos de la semana</p>
        )}
      </div>

      {/* Historial Completo */}
      <h4 style={{ marginBottom: "15px", color: "#1f2937" }}>📋 Historial Completo</h4>

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
