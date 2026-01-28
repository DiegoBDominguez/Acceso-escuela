import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./AdminLayout.css"

const AdminLayout = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  // Función para cerrar sesión correctamente
  const handleLogout = () => {
    localStorage.removeItem('token'); // Limpia el token
    localStorage.setItem('usuario', ''); // Limpia los datos del usuario
    navigate("/"); // Redirige al login
  };

  return (
    <div className="admin-layout">
      {/* TOPBAR */}
      <header className="admin-topbar">
        <button className="toggle" onClick={() => setOpen(!open)}> ☰ </button>
        <h2>BIENVENIDO ADMINISTRADOR</h2>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className={`admin-main ${open ? "" : "full"}`}>
        <Outlet />
      </main>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${open ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3>{open ? "Control Escolar" : "CE"}</h3>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end> Dashboard </NavLink>
          <NavLink to="/admin/students"> Alumnos </NavLink>
          <NavLink to="/admin/attendance"> Asistencias </NavLink>
          <NavLink to="/admin/reports"> Reportes </NavLink>
          
          {/* CAMBIO CLAVE: Apunta a la lista de personal */}
          <NavLink to="/admin/personal"> Personal </NavLink>

          <NavLink to="/admin/settings"> Configuración </NavLink>
        </nav>
      </aside>
    </div>
  )
}

export default AdminLayout