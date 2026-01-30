import { useState, useEffect } from "react";
import Card from "../components/Card";
import { API_ENDPOINTS } from "../config/api";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface SettingsData {
  hora_entrada: string;
  tolerancia_retardo: number;
  hora_salida: string;
  ciclo_escolar: string;
  nombre_escuela: string;
  direccion: string;
  telefono: string;
  email: string;
  inicio_semestre: string;
  fin_semestre: string;
}

interface NonWorkingDay {
  id: number;
  fecha: string;
  descripcion: string;
  tipo: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsData>({
    hora_entrada: "08:00",
    tolerancia_retardo: 10,
    hora_salida: "15:00",
    ciclo_escolar: "2024-2025",
    nombre_escuela: "",
    direccion: "",
    telefono: "",
    email: "",
    inicio_semestre: "",
    fin_semestre: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [nonWorkingDays, setNonWorkingDays] = useState<NonWorkingDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newHolidayDescription, setNewHolidayDescription] = useState("");
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchNonWorkingDays();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SETTINGS_GET);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        console.error("Error al cargar configuraciones:", response.status);
        setMessage("Error al cargar configuraciones");
      }
    } catch (error) {
      console.error("Error al cargar configuraciones:", error);
      setMessage("Error de conexión al cargar configuraciones");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_ENDPOINTS.SETTINGS_UPDATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage("✅ Configuraciones guardadas exitosamente");
      } else {
        const errorData = await response.json();
        setMessage("❌ Error: " + (errorData.mensaje || "No se pudieron guardar las configuraciones"));
      }
    } catch (error) {
      console.error("Error al guardar configuraciones:", error);
      setMessage("❌ Error de conexión al guardar configuraciones");
    } finally {
      setLoading(false);
    }
  };

  const fetchNonWorkingDays = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.NON_WORKING_DAYS_GET);
      if (response.ok) {
        const data = await response.json();
        setNonWorkingDays(data);
      }
    } catch (error) {
      console.error("Error al cargar días no laborables:", error);
    }
  };

  const addNonWorkingDay = async (fecha: string, descripcion: string = "") => {
    setCalendarLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.NON_WORKING_DAYS_ADD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fecha,
          descripcion,
          tipo: "festivo"
        })
      });
      if (response.ok) {
        await fetchNonWorkingDays(); // Recargar la lista
        setNewHolidayDescription("");
        setMessage("Día no laborable agregado correctamente");
      } else {
        setMessage("Error al agregar día no laborable");
      }
    } catch (error) {
      console.error("Error al agregar día no laborable:", error);
      setMessage("Error de conexión");
    }
    setCalendarLoading(false);
  };

  const removeNonWorkingDay = async (fecha: string) => {
    setCalendarLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.NON_WORKING_DAYS_REMOVE(fecha), {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchNonWorkingDays(); // Recargar la lista
        setMessage("Día no laborable eliminado correctamente");
      } else {
        setMessage("Error al eliminar día no laborable");
      }
    } catch (error) {
      console.error("Error al eliminar día no laborable:", error);
      setMessage("Error de conexión");
    }
    setCalendarLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === "tolerancia_retardo" ? parseInt(value) || 0 : value
    }));
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      
      // Días no laborables (rojo)
      if (nonWorkingDays.some(day => day.fecha === dateString)) {
        return 'non-working-day';
      }
      
      // Inicio de semestre (morado)
      if (settings.inicio_semestre === dateString) {
        return 'semester-start';
      }
      
      // Fin de semestre (morado)
      if (settings.fin_semestre === dateString) {
        return 'semester-end';
      }
    }
    return null;
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const nonWorkingDay = nonWorkingDays.find(day => day.fecha === dateString);
      
      if (nonWorkingDay) {
        return (
          <div className="calendar-day-info">
            <span className="holiday-indicator">🎉</span>
            {nonWorkingDay.descripcion && (
              <div className="holiday-tooltip">{nonWorkingDay.descripcion}</div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const existingDay = nonWorkingDays.find(day => day.fecha === dateString);
    
    if (existingDay) {
      // Si ya existe, preguntar si quiere eliminarlo
      if (window.confirm(`¿Eliminar el día no laborable del ${dateString}?`)) {
        removeNonWorkingDay(dateString);
      }
    } else {
      // Si no existe, agregarlo
      const descripcion = prompt("Descripción del día no laborable (opcional):") || "";
      if (descripcion !== null) { // No canceló
        addNonWorkingDay(dateString, descripcion);
      }
    }
  };

  const handleAddHolidayFromInput = () => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      addNonWorkingDay(dateString, newHolidayDescription);
      setSelectedDate(null);
    }
  };

  return (
    <>
    <Card>
      <h2 style={{ marginBottom: "1.5rem", color: "#1f2937", fontSize: "1.5rem" }}>Configuración de la Escuela</h2>
      {message && <p style={{ 
        color: message.includes("Error") ? "#dc2626" : "#16a34a", 
        marginBottom: "1rem", 
        padding: "0.5rem", 
        backgroundColor: message.includes("Error") ? "#fef2f2" : "#f0fdf4",
        borderRadius: "6px",
        border: `1px solid ${message.includes("Error") ? "#fecaca" : "#bbf7d0"}`
      }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Nombre de la Escuela</label>
            <input
              type="text"
              name="nombre_escuela"
              value={settings.nombre_escuela}
              onChange={handleChange}
              placeholder="Ej. Preparatoria Nacional"
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Ciclo Escolar</label>
            <input
              type="text"
              name="ciclo_escolar"
              value={settings.ciclo_escolar}
              onChange={handleChange}
              placeholder="Ej. 2024-2025"
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={settings.direccion}
              onChange={handleChange}
              placeholder="Dirección de la escuela"
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={settings.telefono}
              onChange={handleChange}
              placeholder="Número de teléfono"
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="correo@escuela.com"
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Hora oficial de entrada</label>
            <input
              type="time"
              name="hora_entrada"
              value={settings.hora_entrada}
              onChange={handleChange}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Hora oficial de salida</label>
            <input
              type="time"
              name="hora_salida"
              value={settings.hora_salida}
              onChange={handleChange}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Inicio de Semestre</label>
            <input
              type="date"
              name="inicio_semestre"
              value={settings.inicio_semestre}
              onChange={handleChange}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Fin de Semestre</label>
            <input
              type="date"
              name="fin_semestre"
              value={settings.fin_semestre}
              onChange={handleChange}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "border-color 0.2s",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="settings-submit-btn"
          style={{ 
            padding: "0.75rem 1.5rem", 
            backgroundColor: loading ? "#9ca3af" : "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            fontSize: "1rem", 
            fontWeight: "600", 
            cursor: loading ? "not-allowed" : "pointer", 
            alignSelf: "flex-start"
          }}
        >
          {loading ? "Guardando..." : "Guardar Configuraciones"}
        </button>
      </form>
    </Card>

    {/* CALENDARIO DE DÍAS NO LABORABLES */}
    <Card>
      <h2 style={{ marginBottom: "1.5rem", color: "#1f2937", fontSize: "1.5rem" }}>Calendario de Días No Laborables</h2>
      
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Calendario */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Calendario Interactivo</h3>
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "12px", 
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <Calendar
              onClickDay={handleDateClick}
              tileClassName={tileClassName}
              tileContent={tileContent}
              value={new Date()}
              locale="es-ES"
            />
          </div>
          
          <div style={{ marginTop: "15px", fontSize: "14px", color: "#6b7280" }}>
            <p><strong>Instrucciones:</strong></p>
            <p>• Haz clic en un día para marcarlo como no laborable</p>
            <p>• Haz clic en un día rojo para eliminarlo</p>
            <p>• Los días morados indican inicio/fin de semestre</p>
          </div>
        </div>

        {/* Panel lateral */}
        <div style={{ minWidth: "250px" }}>
          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Agregar Día No Laborable</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                Seleccionar Fecha
              </label>
              <input
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#374151" }}>
                Descripción (opcional)
              </label>
              <input
                type="text"
                value={newHolidayDescription}
                onChange={(e) => setNewHolidayDescription(e.target.value)}
                placeholder="Ej: Día de la Independencia"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            <button
              onClick={handleAddHolidayFromInput}
              disabled={!selectedDate || calendarLoading}
              style={{
                padding: "12px",
                backgroundColor: (!selectedDate || calendarLoading) ? "#9ca3af" : "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: (!selectedDate || calendarLoading) ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
            >
              {calendarLoading ? "Agregando..." : "➕ Agregar Día Festivo"}
            </button>
          </div>

          {/* Lista de días no laborables */}
          <div style={{ marginTop: "30px" }}>
            <h4 style={{ marginBottom: "10px", color: "#374151" }}>Días No Laborables</h4>
            <div style={{ 
              maxHeight: "300px", 
              overflowY: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px"
            }}>
              {nonWorkingDays.length === 0 ? (
                <p style={{ color: "#9ca3af", fontStyle: "italic" }}>No hay días no laborables configurados</p>
              ) : (
                nonWorkingDays.map((day) => (
                  <div key={day.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    marginBottom: "5px",
                    backgroundColor: "#fef2f2",
                    borderRadius: "6px",
                    border: "1px solid #fecaca"
                  }}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#dc2626" }}>
                        {new Date(day.fecha).toLocaleDateString('es-ES', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      {day.descripcion && (
                        <div style={{ fontSize: "12px", color: "#7f1d1d" }}>
                          {day.descripcion}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeNonWorkingDay(day.fecha)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px"
                      }}
                      title="Eliminar día no laborable"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
    </>
  );
};

export default Settings;
