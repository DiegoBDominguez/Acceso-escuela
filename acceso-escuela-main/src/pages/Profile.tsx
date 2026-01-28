import Card from "../components/Card"
import { useState, useEffect } from "react"
import axios from "axios"
import { API_ENDPOINTS } from "../config/api"

interface AlumnoData {
  id: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  correo_institucional: string
  grado: number
  grupo: string
  turno: string
  matricula: string
  foto_url?: string 
}

const Profile = () => {
  const [alumno, setAlumno] = useState<AlumnoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const usuarioStr = localStorage.getItem('usuario')
        const token = localStorage.getItem('token')
        
        if (!token || !usuarioStr) {
          setError("Sesión expirada. Por favor inicia sesión nuevamente.")
          return
        }

        const usuario = JSON.parse(usuarioStr)
        const respuesta = await axios.get(
          API_ENDPOINTS.ALUMNOS_PERFIL(usuario.id),
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (respuesta.data.data) {
          setAlumno(respuesta.data.data)
        }
      } catch (err: any) {
        console.error("Error cargando perfil:", err)
        setError("No se pudo cargar la información del perfil.")
      } finally {
        setLoading(false)
      }
    }
    cargarPerfil()
  }, [])

  if (loading) return <div className="p-4"><h2>Cargando perfil...</h2></div>
  if (error || !alumno) return <div className="p-4"><h2>❌ {error}</h2></div>

  const imagenUrl = alumno.foto_url ? `${API_ENDPOINTS.UPLOADS_URL}${alumno.foto_url}` : null;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Mi Perfil Estudiantil</h2>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: '15px' 
      }}>
        
        {/* SECCIÓN DE LA FOTO: AJUSTE PERFECTO */}
        <Card>
          <div style={{ 
            height: "280px", // Ajustamos altura para que se vea más profesional
            width: "100%",
            background: "#f0f4f8", 
            borderRadius: "12px", // Bordes más suaves
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            overflow: 'hidden', // Corta lo que sobre de la imagen
            border: '1px solid #e2e8f0'
          }}>
            {imagenUrl ? (
              <img 
                src={imagenUrl} 
                alt="Foto de perfil" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain', // Llena el contenedor sin estirarse
                  backgroundColor: '#f8fafc',
                  objectPosition: 'center top' // Prioriza mostrar la parte superior (cara)
                }} 
              />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: "50px", color: "#2563eb", fontWeight: "bold" }}>
                  {alumno.nombre[0]}{alumno.apellido_paterno[0]}
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>Sin foto de perfil</p>
              </div>
            )}
          </div>
        </Card>

        {/* SECCIÓN DE DATOS */}
        <Card>
          <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', color: '#1e293b' }}>
            Información Académica
          </h3>
          <div style={{ lineHeight: '2.4', marginTop: '20px', color: '#334155' }}>
            <p><strong>Nombre Completo:</strong> {`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`}</p>
            <p><strong>Matrícula:</strong> <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{alumno.matricula}</span></p>
            <p><strong>Grado y Grupo:</strong> {alumno.grado}° "{alumno.grupo}"</p>
            <p><strong>Turno:</strong> {alumno.turno}</p>
            <p><strong>Correo:</strong> {alumno.correo_institucional || "No asignado"}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile