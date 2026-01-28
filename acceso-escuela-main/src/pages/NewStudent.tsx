import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { API_BASE_URL } from "../config/api" 
import Card from "../components/Card"
import "./NewStudent.css"

const NewStudent = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", 
    paternal_last_name: "", 
    maternal_last_name: "",
    matricula: "", 
    email: "", 
    grade: "", 
    group: "", 
    shift: "", 
    password: "", // 🔑 Nuevo campo para la contraseña
    photo: null as File | null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, photo: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 📦 Empaquetamos todo en FormData para enviar texto y archivo
    const data = new FormData()
    data.append("nombre", form.name)
    data.append("apellido_paterno", form.paternal_last_name)
    data.append("apellido_materno", form.maternal_last_name)
    data.append("matricula", form.matricula)
    data.append("correo_institucional", form.email)
    data.append("grado", form.grade)
    data.append("grupo", form.group)
    data.append("turno", form.shift.toUpperCase())
    data.append("password", form.password) // 📤 Enviamos la contraseña al backend

    if (form.photo) {
      data.append("foto", form.photo) // Coincide con upload.single('foto')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/alumnos/registro`, {
        method: "POST",
        body: data,
      })

      const resultado = await response.json()

      if (response.ok) {
        alert("¡Registro exitoso! El alumno ya puede iniciar sesión.")
        navigate("/admin/students")
      } else {
        alert(resultado.mensaje || "Error en el servidor. Verifica los datos.")
      }
    } catch (error) {
      alert("Error de conexión: ¿Está encendido el servidor Node.js?")
    }
  }

  return (
    <div className="new-student-container">
      <div className="back-link" onClick={() => navigate("/admin/students")} style={{cursor: 'pointer', marginBottom: '15px'}}>
        ⬅ Volver a alumnos
      </div>

      <Card>
        <form className="new-student-form" onSubmit={handleSubmit}>
          <h2 style={{color: '#1e3a8a', marginBottom: '20px'}}>Registrar Nuevo Estudiante</h2>
          
          <div className="form-grid">
            <div>
              <label>Nombre(s)</label>
              <input type="text" name="name" onChange={handleChange} required />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <div>
                <label>Apellido P.</label>
                <input type="text" name="paternal_last_name" onChange={handleChange} required />
              </div>
              <div>
                <label>Apellido M.</label>
                <input type="text" name="maternal_last_name" onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Matrícula</label>
              <input type="text" name="matricula" maxLength={9} onChange={handleChange} required />
            </div>
            <div>
              <label>Correo Institucional</label>
              <input type="email" name="email" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
            <div>
              <label>Grado</label>
              <select name="grade" onChange={handleChange} required>
                <option value="">Selecciona...</option>
                <option value="1">1°</option>
                <option value="2">2°</option>
                <option value="3">3°</option>
              </select>
            </div>
            <div>
              <label>Grupo</label>
              <select name="group" onChange={handleChange} required>
                <option value="">Selecciona...</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div>
              <label>Turno</label>
              <select name="shift" onChange={handleChange} required>
                <option value="">Selecciona...</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Fotografía del Alumno</label>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{padding: '8px'}} />
              {form.photo && (
                <img 
                  src={URL.createObjectURL(form.photo)} 
                  alt="Preview" 
                  style={{width: '120px', height: '150px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px', border: '2px solid #dbeafe'}} 
                />
              )}
            </div>
            {/* 🔐 Sección de Contraseña */}
            <div>
              <label style={{fontWeight: 'bold', color: '#1e40af'}}>Contraseña de Acceso</label>
              <input 
                type="text" 
                name="password" 
                onChange={handleChange} 
                required 
                placeholder="Ej: Alumno2026*" 
                style={{border: '2px solid #3b82f6'}}
              />
              <p style={{fontSize: '12px', color: '#64748b', marginTop: '5px'}}>
                Esta clave permitirá al alumno entrar a su perfil.
              </p>
            </div>
          </div>

          <div className="form-actions" style={{marginTop: '20px'}}>
            <button type="submit" className="btn-submit" style={{
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '6px', 
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
              cursor: 'pointer'
            }}>
              Finalizar Registro
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NewStudent