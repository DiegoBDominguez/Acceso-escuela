import { useState } from "react";
import Card from "../components/Card";
import { API_ENDPOINTS } from "../config/api";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
  const [filters, setFilters] = useState({
    userType: "all",
    period: "custom",
    fromDate: "",
    toDate: "",
    showPercentages: false,
    grade: "",
    group: ""
  });

  const handlePeriodChange = (period: string) => {
    const today = new Date();
    let fromDate = "";
    let toDate = today.toISOString().split('T')[0];

    if (period === "today") {
      fromDate = toDate;
    } else if (period === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      fromDate = weekAgo.toISOString().split('T')[0];
    } else if (period === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      fromDate = monthAgo.toISOString().split('T')[0];
    }

    setFilters(prev => ({ ...prev, period, fromDate, toDate }));
  };
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchReportData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== false && key !== "period") params.append(key, String(value));
      });

      const response = await fetch(`${API_ENDPOINTS.REPORTS_GET}?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setMessage(`Datos cargados: ${result.length} registros`);
      } else {
        setMessage("Error al cargar los datos");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error de conexión");
    }
    setLoading(false);
  };

  const generateExcel = () => {
    if (data.length === 0) {
      setMessage("No hay datos para exportar");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const generatePDF = () => {
    if (data.length === 0) {
      setMessage("No hay datos para exportar");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Reporte de Asistencia`, 20, 20);

    const tableColumn = Object.keys(data[0] || {});
    const tableRows = data.map(row => Object.values(row));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`reporte_asistencia_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card>
      <h2 style={{ marginBottom: "1.5rem", color: "#1f2937", fontSize: "1.5rem" }}>Generar Reportes</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Tipo de Usuario</label>
            <select
              name="userType"
              value={filters.userType}
              onChange={handleFilterChange}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none"
              }}
            >
              <option value="all">Todos</option>
              <option value="alumno">Alumnos</option>
              <option value="admin">Administradores</option>
              <option value="entrada">Entrada</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Período</label>
            <select
              value={filters.period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none"
              }}
            >
              <option value="custom">Personalizado</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>

          {filters.period === "custom" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Fecha Desde</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Grado</label>
            <input
              type="text"
              name="grade"
              value={filters.grade}
              onChange={handleFilterChange}
              placeholder="Ej. 1A, 2B"
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>Grupo</label>
            <input
              type="text"
              name="group"
              value={filters.group}
              onChange={handleFilterChange}
              placeholder="Ej. A, B"
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="showPercentages"
              checked={filters.showPercentages}
              onChange={(e) => setFilters(prev => ({ ...prev, showPercentages: e.target.checked }))}
              style={{ width: "auto" }}
            />
            <label style={{ fontWeight: "600", color: "#374151" }}>Mostrar Porcentajes</label>
          </div>
        </div>

        <button
          onClick={fetchReportData}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            alignSelf: "flex-start"
          }}
        >
          {loading ? "Cargando..." : "Generar Reporte"}
        </button>
      </div>

      {message && (
        <p style={{
          color: message.includes("Error") ? "#dc2626" : "#16a34a",
          marginBottom: "1rem",
          padding: "0.5rem",
          backgroundColor: message.includes("Error") ? "#fef2f2" : "#f0fdf4",
          borderRadius: "6px",
          border: `1px solid ${message.includes("Error") ? "#fecaca" : "#bbf7d0"}`
        }}>
          {message}
        </p>
      )}

      {data.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", color: "#1f2937" }}>Vista Previa de Datos ({data.length} registros)</h3>
          
          <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {Object.keys(data[0]).map(key => (
                    <th key={key} style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #e5e7eb", fontWeight: "600" }}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} style={{ padding: "0.5rem", border: "1px solid #e5e7eb" }}>
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 10 && <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
              Mostrando 10 de {data.length} registros. Exporta para ver todos.
            </p>}
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={generateExcel}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              📊 Exportar Excel
            </button>
            <button
              onClick={generatePDF}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              📄 Exportar PDF
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Reports;
