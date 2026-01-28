import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import Card from "../components/Card";
import axios from "axios";

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
          <table width="100%" style={{ borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ textAlign: "left", backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "16px" }}>Matrícula</th>
                <th style={{ padding: "16px" }}>Nombre Completo</th>
                <th style={{ padding: "16px" }}>Grado/Grupo</th>
                <th style={{ padding: "16px" }}>Turno</th>
                <th style={{ padding: "16px" }}>Estado</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Cargando lista de alumnos...</td></tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((alumno) => (
                  <tr key={alumno.id} className="table-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px", fontWeight: "600", color: "#2563eb" }}>
                      {alumno.matricula || <span style={{color: '#94a3b8', fontSize: '12px', fontWeight: "normal"}}>Sin Matrícula</span>}
                    </td>
                    <td style={{ padding: "16px", color: "#334155" }}>
                      {`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`}
                    </td>
                    <td style={{ padding: "16px" }}>{`${alumno.grado}° "${alumno.grupo}"`}</td>
                    <td style={{ padding: "16px" }}>{alumno.turno}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ 
                        padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                        backgroundColor: alumno.activo ? "#dcfce7" : "#fee2e2",
                        color: alumno.activo ? "#166534" : "#991b1b"
                      }}>
                        {alumno.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button 
                        onClick={() => editarAlumno(alumno)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", marginRight: "12px" }}
                        title="Editar Datos"
                      >✏️</button>
                      <button 
                        onClick={() => eliminarAlumno(alumno.id, alumno.nombre)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                        title="Eliminar permanentemente"
                      >🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No se encontraron alumnos con ese nombre.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Students;