import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"

// ADMIN
import Dashboard from "./pages/Dashboard"
import Students from "./pages/Students"
import Attendance from "./pages/Attendance"
import Reports from "./pages/Reports"
import Settings from "./pages/settings"
import AdminAttendance from "./pages/AdminAttendance"
import NewStudent from "./pages/NewStudent"


// ALUMNO
import Profile from "./pages/Profile"
import StudentQR from "./pages/StudentQR"


// LAYOUTS
import AdminLayout from "./layouts/AdminLayout"
import StudentLayout from "./layouts/StudentLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ================= ALUMNO ================= */}
        <Route path="/students" element={<StudentLayout />}>
          <Route index element={<Profile />} />
          <Route path="attendance" element={<Attendance />} />
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

      </Routes>
    </BrowserRouter>
  )
}

export default App
