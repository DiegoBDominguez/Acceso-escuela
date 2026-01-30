import { useState, useEffect } from "react";
import Card from "../components/Card";
import { API_ENDPOINTS } from "../config/api";
import "./Attendance.css";

interface AttendanceRecord {
  id: number;
  matricula: string;
  nombre_completo: string;
  fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  estado: string;
}

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [matriculaFilter, setMatriculaFilter] = useState<string>("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");

  // Cargar asistencias al montar el componente
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async (filters: { fecha?: string; matricula?: string; estado?: string } = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.fecha) params.append('fecha', filters.fecha);
      if (filters.matricula) params.append('matricula', filters.matricula);
      if (filters.estado && filters.estado !== 'todos') params.append('estado', filters.estado);

      const response = await fetch(`${API_ENDPOINTS.ASISTENCIAS_ADMIN}?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.data || []);
      } else {
        console.error("Error al cargar asistencias");
        setAttendanceData([]);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAttendance({
      fecha: selectedDate,
      matricula: matriculaFilter,
      estado: estadoFilter
    });
  };

  const handleWeekdayClick = (weekdayIndex: number) => {
    // weekdayIndex: 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    
    // Calcular cuántos días necesitamos restar para llegar al lunes de esta semana
    let daysToMonday = currentDay - 1; // Si es lunes (1), daysToMonday = 0
    if (currentDay === 0) daysToMonday = -6; // Si es domingo, ir al lunes anterior
    
    // Calcular la fecha del día específico de la semana
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysToMonday + (weekdayIndex - 1));
    
    const dateString = targetDate.toISOString().split('T')[0];
    setSelectedDate(dateString);
    fetchAttendance({
      fecha: dateString,
      matricula: matriculaFilter,
      estado: estadoFilter
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5); // HH:MM
  };

  const getStatusClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'presente': return 'present';
      case 'retardo': return 'late';
      case 'falta': return 'absent';
      default: return '';
    }
  };

  return (
    <>
      <h2>Control de Asistencias</h2>

      {/* FILTROS */}
      <Card>
        <h4 style={{ marginBottom: "20px", color: "#1f2937" }}>Filtros de Búsqueda</h4>

        <div style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                transition: "border-color 0.2s, box-shadow 0.2s",
                outline: "none",
                minWidth: "160px"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* BOTONES RÁPIDOS DE FECHA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Fecha Rápida
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleWeekdayClick(1)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#059669"}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#10b981"}
              >
                L
              </button>
              <button
                onClick={() => handleWeekdayClick(2)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#d97706"}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#f59e0b"}
              >
                M
              </button>
              <button
                onClick={() => handleWeekdayClick(3)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#2563eb"}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#3b82f6"}
              >
                M
              </button>
              <button
                onClick={() => handleWeekdayClick(4)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#7c3aed"}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#8b5cf6"}
              >
                J
              </button>
              <button
                onClick={() => handleWeekdayClick(5)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#dc2626"}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#ef4444"}
              >
                V
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Matrícula
            </label>
            <input
              type="text"
              placeholder="Buscar por matrícula..."
              value={matriculaFilter}
              onChange={(e) => setMatriculaFilter(e.target.value)}
              style={{
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                transition: "border-color 0.2s, box-shadow 0.2s",
                outline: "none",
                minWidth: "200px"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Estado
            </label>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              style={{
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "white",
                transition: "border-color 0.2s, box-shadow 0.2s",
                outline: "none",
                minWidth: "180px",
                cursor: "pointer"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="presente">Presente</option>
              <option value="retardo">Retardo</option>
              <option value="falta">Falta</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "end" }}>
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: "12px 24px",
                backgroundColor: loading ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s, transform 0.1s",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = "#2563eb")}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = "#3b82f6")}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => !loading && ((e.target as HTMLButtonElement).style.transform = "scale(0.98)")}
              onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => !loading && ((e.target as HTMLButtonElement).style.transform = "scale(1)")}
            >
              {loading ? "🔄 Buscando..." : "🔍 Buscar"}
            </button>
          </div>
        </div>
      </Card>

      {/* TABLA */}
      <Card>
        <h3>Registro de Asistencias</h3>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <div>🔄 Cargando asistencias...</div>
          </div>
        ) : attendanceData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <div>📋 No se encontraron registros de asistencia</div>
            <div style={{ fontSize: "14px", marginTop: "8px" }}>
              {selectedDate ? `para la fecha ${formatDate(selectedDate)}` : "con los filtros aplicados"}
            </div>
          </div>
        ) : (
          <div className="table-wrapper" style={{ overflowX: "auto" }}>
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
                {attendanceData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.matricula}</td>
                    <td>{record.nombre_completo}</td>
                    <td>{formatDate(record.fecha)}</td>
                    <td>{formatTime(record.hora_entrada)}</td>
                    <td>{formatTime(record.hora_salida)}</td>
                    <td>
                      <span className={`status ${getStatusClass(record.estado)}`}>
                        {record.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
};

export default AdminAttendance;
