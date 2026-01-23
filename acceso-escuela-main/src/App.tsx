import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"

// ADMIN
import Dashboard from "./pages/Dashboard"
import Students from "./pages/Students"
import Reports from "./pages/Reports"
import Settings from "./pages/settings"
import AdminAttendance from "./pages/AdminAttendance"
import NewStudent from "./pages/NewStudent"


// ALUMNO
import Profile from "./pages/Profile"
import StudentQR from "./pages/StudentQR"
import StudentAttendance from "./pages/StudentAttendance"


// LAYOUTS
import AdminLayout from "./layouts/AdminLayout"
import StudentLayout from "./layouts/StudentLayout"
import EntradaLayout from "./layouts/EntradaLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ================= ALUMNO ================= */}
        <Route path="/students" element={<StudentLayout />}>
          <Route index element={<Profile />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="qr" element={<StudentQR />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/new" element={<NewStudent />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= ENTRADA ================= */}
        <Route path="/entrada" element={<EntradaLayout />}>
          <Route index element={<div style={{textAlign: 'center'}}><h3>Sistema de Entrada Listo</h3></div>} />
        </Route>

        {/* Rutas antiguas o inválidas redirigen al login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
