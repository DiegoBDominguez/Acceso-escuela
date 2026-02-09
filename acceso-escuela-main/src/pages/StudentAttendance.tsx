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
  estado: string | null
}

interface EstadisticasSemana {
  total_asistencias: number
  total_faltas: number
  total_tardes: number
  porcentaje_asistencia: number
}

interface DatosSemana {
  semana: {
    inicio: string
    fin: string
  }
  dias: DiaSemana[]
  estadisticas: EstadisticasSemana
  inicio_semestre: string
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
              {datosSemana.dias.map((dia, index) => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaDia = new Date(dia.fecha + 'T12:00:00'); // Usar mediodía para evitar problemas de zona horaria
                const isFuture = fechaDia > hoy;
                const inicioSemestre = new Date(datosSemana.inicio_semestre + 'T12:00:00');
                const isBeforeStart = fechaDia < inicioSemestre;

                // Determinar color y estado basado en la entrada y hora
                let backgroundColor = "#fef2f2"; // Rojo por defecto (ausente)
                let borderColor = "#dc2626";
                let statusText = "❌ Ausente";
                let statusColor = "#dc2626";

                if (dia.entrada) {
                  // Si hay entrada, determinar si es presente o retardo basado en hora
                  const horaLimite = '07:00:00';
                  const esPresente = dia.entrada <= horaLimite;
                  if (esPresente) {
                    backgroundColor = "#dcfce7"; // Verde
                    borderColor = "#16a34a";
                    statusText = "✅ Presente";
                    statusColor = "#16a34a";
                  } else {
                    backgroundColor = "#fef3c7"; // Amarillo
                    borderColor = "#f59e0b";
                    statusText = "⏰ Retardo";
                    statusColor = "#f59e0b";
                  }
                } else if (isBeforeStart) {
                  backgroundColor = "#f3f4f6";
                  borderColor = "#9ca3af";
                  statusText = "🚫 No disponible";
                  statusColor = "#6b7280";
                } else if (isFuture) {
                  backgroundColor = "#f3f4f6";
                  borderColor = "#9ca3af";
                  statusText = "⏳ Pendiente";
                  statusColor = "#6b7280";
                }

                return (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      backgroundColor: backgroundColor,
                      border: `2px solid ${borderColor}`,
                      borderRadius: "8px",
                      textAlign: "center",
                      opacity: isFuture || isBeforeStart ? 0.7 : 1
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>
                      {dia.dia.charAt(0).toUpperCase() + dia.dia.slice(1)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                      {dia.fecha.split('-').reverse().join('/').substring(0,5)}
                    </div>
                    {dia.estado ? (
                      <>
                        <div style={{ fontSize: "14px", fontWeight: "bold", color: statusColor, marginBottom: "4px" }}>
                          {statusText}
                        </div>
                        <div style={{ fontSize: "12px", color: "#374151" }}>
                          <div>Entrada: {dia.entrada ? dia.entrada.substring(0, 5) : '-'}</div>
                          <div>Salida: {dia.salida ? dia.salida.substring(0, 5) : '-'}</div>
                        </div>
                      </>
                    ) : isBeforeStart ? (
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#6b7280" }}>
                        🚫 No disponible
                      </div>
                    ) : isFuture ? (
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#6b7280" }}>
                        ⏳ Pendiente
                      </div>
                    ) : (
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#dc2626" }}>
                        ❌ Ausente
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="attendance-stats" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
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
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#eab308" }}>
                  {datosSemana.estadisticas.total_tardes}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Retardos</div>
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
