import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "./StudentLayout.css"

const StudentLayout = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const firstLogin = localStorage.getItem('firstLogin')
    
    if (isMobile && firstLogin) {
      setOpen(false)
      localStorage.removeItem('firstLogin') // Remover para que no se cierre en futuros inicios
    }
  }, [])

  return (
    <div className="student-layout">

      {/* HEADER */}
      <header className="student-topbar">
        <button className="toggle" onClick={() => setOpen(!open)}> ☰ </button>
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
        <NavLink to="/students/qr" end>MI QR</NavLink>
        <NavLink to="/students/attendance" end>MI ASISTENCIA</NavLink>
        <NavLink to="/students" end>MI PERFIL</NavLink>
      </aside>
    </div>
  )
}

export default StudentLayout
