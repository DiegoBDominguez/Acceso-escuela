import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./AdminLayout.css"

const AdminLayout = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <div className="admin-layout">

      {/* TOPBAR */}
      <header className="admin-topbar">
        {/* BOTÓN HAMBURGUESA */}
        <button className="toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <h2>BIENVENIDO ADMINISTRADOR</h2>
        <button onClick={() => navigate("/")}>
          Cerrar sesión
        </button>
      </header>

      {/* CONTENIDO */}
      <main className={`admin-main ${open ? "" : "full"}`}>
        <Outlet />
      </main>

      {/* SIDEBAR DERECHO */}
      <aside className={`admin-sidebar ${open ? "open" : "closed"}`}>

        {/* HEADER DEL SIDEBAR */}
        <div className="sidebar-header">
          <h3>{open ? "Control Escolar" : "CE"}</h3>
          {/* /*<button className="toggle" onClick={() => setOpen(!open)}>
            ☰
          </button> */}
        </div>

        {/* MENÚ */}
        <nav className="sidebar-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/students">
            Alumnos
          </NavLink>

          <NavLink to="/admin/attendance">
            Asistencias
          </NavLink>

          <NavLink to="/admin/reports">
            Reportes
          </NavLink>

          <NavLink to="/admin/settings">
            Configuración
          </NavLink>
        </nav>

      </aside>
    </div>
  )
}

export default AdminLayout
