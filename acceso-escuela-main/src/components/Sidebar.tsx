import { Link } from "react-router-dom"

type Props = {
  collapsed: boolean
}

const Sidebar = ({ collapsed }: Props) => {
  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      
      <h2 className="sidebar-title">
        {collapsed ? "CE" : "Control Escolar"}
      </h2>

      <nav>
        <Link to="/dashboard">📊 Dashboard</Link>
        <Link to="/dashboard?section=students">🎓 Alumnos</Link>
        <Link to="/dashboard?section=register">➕ Registro Alumno</Link>
        <Link to="/dashboard?section=attendance">⏱ Asistencias</Link>
        <Link to="/dashboard?section=qr">🔳 Códigos QR</Link>
        <Link to="/dashboard?section=reports">📄 Reportes</Link>
        <Link to="/dashboard?section=settings">⚙️ Configuración</Link>
      </nav>
    </aside>
  )
}

export default Sidebar
