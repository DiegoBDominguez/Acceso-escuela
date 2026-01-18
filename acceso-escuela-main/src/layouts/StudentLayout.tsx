import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./StudentLayout.css"

const StudentLayout = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <div className="student-layout">

      {/* HEADER */}
      <header className="student-topbar">
        <h2>BIENVENIDO ALUMNO</h2>

        <button className="logout" onClick={() => navigate("/")}>
          SALIR
        </button>
      </header>

      {/* CONTENIDO */}
      <main className="student-main" >
        <Outlet />
      </main>

      {/* MENU DERECHO */}
      <aside className={`student-sidebar ${open ? "open" : "closed"}`}>
        <button className="toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <NavLink to="/students/qr" end>MI QR</NavLink>
        <NavLink to="/students/attendance" end>MI ASISTENCIA</NavLink>
        <NavLink to="/students" end>MI PERFIL</NavLink>
      </aside>
    </div>
  )
}

export default StudentLayout
