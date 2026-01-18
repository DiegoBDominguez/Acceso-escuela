import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Card from "../components/Card"
import "./NewStudent.css"

interface FormData {
  name: string
  matricula: string
  email: string
  group: string
  shift: string
}

const NewStudent = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormData>({
    name: "",
    matricula: "",
    email: "",
    group: "",
    shift: ""
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors: Partial<FormData> = {}

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!/^[0-9]{9}$/.test(form.matricula)) {
      newErrors.matricula = "La matrícula debe tener 9 dígitos"
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Correo electrónico inválido"
    }

    if (!form.group) {
      newErrors.group = "Selecciona un grupo"
    }

    if (!form.shift) {
      newErrors.shift = "Selecciona un turno"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    alert("Alumno registrado correctamente")
    navigate("/admin/students")
  }

  return (
    <>
      {/* FLECHA ATRÁS */}
      <div className="back-link" onClick={() => navigate("/admin/students")}>
        ⬅ Volver a alumnos
      </div>

      <h2>Registrar nuevo alumno</h2>

      <Card className="new-student-container">
        <form className="new-student-form" onSubmit={handleSubmit}>
          {/* NOMBRE */}
          <div>
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              placeholder="Ej. Juan Pérez"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>

          {/* MATRÍCULA + CORREO */}
          <div className="form-grid">
            <div>
              <label>Matrícula</label>
              <input
                type="text"
                name="matricula"
                placeholder="9 dígitos"
                value={form.matricula}
                maxLength={9}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    setForm({ ...form, matricula: value })
                }}
                className={errors.matricula ? "error" : ""}
              />
              {errors.matricula && (
                <span className="error-text">{errors.matricula}</span>
              )}
            </div>

            <div>
              <label>Correo institucional</label>
              <input
                type="email"
                name="email"
                placeholder="alumno@escuela.edu.mx"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
          </div>

          {/* GRUPO + TURNO */}
          <div className="form-grid">
            <div>
              <label>Grupo</label>
              <select
                name="group"
                value={form.group}
                onChange={handleChange}
                className={errors.group ? "error" : ""}
              >
                <option value="">Selecciona grupo</option>
                <option>3° A</option>
                <option>3° B</option>
              </select>
              {errors.group && (
                <span className="error-text">{errors.group}</span>
              )}
            </div>

            <div>
              <label>Turno</label>
              <select
                name="shift"
                value={form.shift}
                onChange={handleChange}
                className={errors.shift ? "error" : ""}
              >
                <option value="">Selecciona turno</option>
                <option>Matutino</option>
                <option>Vespertino</option>
              </select>
              {errors.shift && (
                <span className="error-text">{errors.shift}</span>
              )}
            </div>
          </div>

          {/* BOTÓN */}
          <div className="form-actions">
            <button type="submit" className="btn secondary">
              Guardar alumno
            </button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default NewStudent
