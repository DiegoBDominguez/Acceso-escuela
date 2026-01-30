import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import Card from "../components/Card";
import axios from "axios";
import "./Students.css";

interface Alumno {
  id: number;
  matricula: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  grado: string;
  grupo: string;
  turno: string;
  activo: number;
  foto_url?: string;
  porcentaje_asistencia?: number;
}

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Alumno[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Función para cargar alumnos
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Agregamos el token si tu ruta está protegida
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/alumnos/lista`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 200) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ELIMINACIÓN ROBUSTA
  const eliminarAlumno = async (id: number, nombre: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar a ${nombre}? Esta acción borrará también sus asistencias y códigos QR.`);
    
    if (confirmar) {
      try {
        const token = localStorage.getItem('token');
        // Usamos el ID del alumno como se espera en el backend
        const response = await axios.delete(`${API_BASE_URL}/api/alumnos/eliminar/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          alert("🗑️ Registro eliminado con éxito");
          // Actualizamos la lista local inmediatamente para que el usuario vea el cambio
          setStudents(prev => prev.filter(s => s.id !== id));
        }
      } catch (error: any) {
        console.error("Error al eliminar:", error);
        const mensajeError = error.response?.data?.mensaje || "Error de conexión con el servidor";
        alert(`❌ No se pudo eliminar: ${mensajeError}`);
      }
    }
  };

  const editarAlumno = (alumno: Alumno) => {
    // IMPORTANTE: Asegúrate de que la ruta en App.tsx coincida con esta
    navigate(`/admin/students/edit/${alumno.id}`, { state: { alumno } });
  };

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.nombre} ${s.apellido_paterno} ${s.apellido_materno}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) || 
      (s.matricula?.toLowerCase().includes(search) ?? false)
    );
  });

  return (
    <div className="students-container" style={{ padding: "20px" }}>
      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Administración de Alumnos</h2>
      <Card>
        <div style={{ display: "flex", gap: "15px", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Buscar por matrícula o nombre completo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: "300px", 
              padding: "12px", 
              borderRadius: "8px", 
              border: "1px solid #cbd5e1",
              fontSize: "14px"
            }}
          />
          <button
            onClick={() => navigate("/admin/students/new")}
            style={{ 
              backgroundColor: "#2563eb", 
              color: "white", 
              padding: "12px 24px", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontWeight: "600",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            + Registrar nuevo alumno
          </button>
        </div>

        <div className="table-wrapper" style={{ overflowX: "auto" }}>
          <table className="students-table">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre Completo</th>
                <th>Grado</th>
                <th>Grupo</th>
                <th>Turno</th>
                <th>Asistencia</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Cargando lista de alumnos...</td></tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((alumno) => (
                  <tr key={alumno.id}>
                    <td style={{ fontWeight: "600", color: "#2563eb" }}>
                      {alumno.matricula || <span style={{color: '#94a3b8', fontSize: '12px', fontWeight: "normal"}}>Sin Matrícula</span>}
                    </td>
                    <td>
                      {`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`}
                    </td>
                    <td>{alumno.grado}°</td>
                    <td>{alumno.grupo}</td>
                    <td>{alumno.turno}</td>
                    <td>
                      {(() => {
                        const rawValue = alumno.porcentaje_asistencia;
                        const percentage = typeof rawValue === 'number' ? rawValue : 
                                         typeof rawValue === 'string' ? parseFloat(rawValue) || 0 : 0;
                        return (
                          <span className="attendance-badge" style={{
                            backgroundColor: percentage >= 80 ? "#dcfce7" : percentage >= 60 ? "#fef3c7" : "#fee2e2",
                            color: percentage >= 80 ? "#166534" : percentage >= 60 ? "#92400e" : "#991b1b"
                          }}>
                            {rawValue !== undefined && rawValue !== null ? `${percentage.toFixed(1)}%` : "N/A"}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <span className="status-badge" style={{
                        backgroundColor: alumno.activo ? "#dcfce7" : "#fee2e2",
                        color: alumno.activo ? "#166534" : "#991b1b"
                      }}>
                        {alumno.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => editarAlumno(alumno)}
                          title="Editar Datos"
                        >✏️</button>
                        <button 
                          onClick={() => eliminarAlumno(alumno.id, alumno.nombre)}
                          title="Eliminar permanentemente"
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No se encontraron alumnos con ese nombre.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Students;