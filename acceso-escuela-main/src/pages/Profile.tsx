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
}

const Profile = () => {
  const [alumno, setAlumno] = useState<AlumnoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError("No autenticado")
          return
        }

        console.log('📦 Usuario del localStorage:', usuario)
        console.log('🔑 ID del usuario:', usuario.id)

        // Obtener datos del perfil desde el backend
        const respuesta = await axios.get(
          API_ENDPOINTS.ALUMNOS_PERFIL(usuario.id),
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log('✅ Datos del perfil:', respuesta.data)

        if (respuesta.data.data) {
          setAlumno(respuesta.data.data)
        }
      } catch (err: any) {
        console.error('❌ Error al cargar perfil:', err)
        setError("Error al cargar los datos del perfil")
      } finally {
        setLoading(false)
      }
    }

    cargarPerfil()
  }, [])

  if (loading) {
    return <div><h2>Cargando perfil...</h2></div>
  }

  if (error) {
    return <div><h2>❌ {error}</h2></div>
  }

  if (!alumno) {
    return <div><h2>No se encontraron datos del alumno</h2></div>
  }

  return (
    <>
      <h2>Mi Perfil</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <Card>
          <div style={{
            height: "260px",
            background: "#dbeafe",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "#2563eb"
          }}>
            FOTO
          </div>
        </Card>

        <Card>
          <h3>Información Personal</h3>
          <p><strong>Nombre:</strong> {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}</p>
          <p><strong>Matrícula:</strong> {alumno.matricula}</p>
          <p><strong>Grado:</strong> {alumno.grado}°</p>
          <p><strong>Grupo:</strong> {alumno.grupo}</p>
          <p><strong>Turno:</strong> {alumno.turno}</p>
          <p><strong>Correo:</strong> {alumno.correo_institucional || "No disponible"}</p>
        </Card>
      </div>
    </>
  )
}

export default Profile

