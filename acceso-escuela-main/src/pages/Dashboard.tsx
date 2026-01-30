import { useState, useEffect } from "react";
import Card from "../components/Card";
import { API_ENDPOINTS, getConnectionInfo } from "../config/api";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./Dashboard.css";

interface DashboardStats {
  total_alumnos: number;
  asistencias_hoy: {
    presentes: number;
    retardos: number;
    faltas: number;
    total_registros: number;
  };
  distribucion_grados: Array<{
    grado: string;
    total_alumnos: number;
    presentes: number;
    retardos: number;
    faltas: number;
  }>;
  fecha_actual: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [connectionInfo, setConnectionInfo] = useState<any>(null);

  useEffect(() => {
    // Mostrar información de conexión al cargar
    setConnectionInfo(getConnectionInfo());
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('checking');

      const response = await fetch(API_ENDPOINTS.ASISTENCIAS_DASHBOARD_STATS, {
        signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
        setConnectionStatus('connected');
      } else {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setConnectionStatus('disconnected');

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError("⏱️ Tiempo de espera agotado. Verifica tu conexión a internet y la configuración de IP.");
        } else if (error.message.includes('fetch')) {
          setError("🌐 No se puede conectar al servidor. Verifica que el backend esté ejecutándose y la IP sea correcta.");
        } else {
          setError(`❌ Error de conexión: ${error.message}`);
        }
      } else {
        setError("❌ Error desconocido al cargar las estadísticas.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos para la gráfica de pastel
  const pieData = stats ? [
    { name: 'Presentes', value: stats.asistencias_hoy.presentes, color: '#10b981' },
    { name: 'Retardos', value: stats.asistencias_hoy.retardos, color: '#f59e0b' },
    { name: 'Faltas', value: stats.asistencias_hoy.faltas, color: '#ef4444' },
  ] : [];

  // Preparar datos para la gráfica de barras por grados
  const barData = stats ? stats.distribucion_grados.map(grado => ({
    grado: grado.grado || 'Sin grado',
    presentes: grado.presentes || 0,
    retardos: grado.retardos || 0,
    faltas: grado.faltas || 0,
    total: grado.total_alumnos || 0
  })) : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Dashboard</h2>
        <div style={{ fontSize: "18px", color: "#6b7280" }}>
          🔄 Cargando estadísticas...
          <br />
          <small style={{ fontSize: "14px", color: "#9ca3af" }}>
            Estado de conexión: {connectionStatus === 'checking' ? 'Verificando...' : connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
          </small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Dashboard</h2>
        <div style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px 0",
          color: "#dc2626"
        }}>
          <h3 style={{ margin: "0 0 10px 0" }}>⚠️ Error de Conexión</h3>
          <p style={{ margin: "0 0 15px 0", fontSize: "16px" }}>{error}</p>
          <div style={{ fontSize: "14px", color: "#7f1d1d" }}>
            <p><strong>Soluciones posibles:</strong></p>
            <ul style={{ textAlign: "left", display: "inline-block" }}>
              <li>Verifica que el servidor backend esté ejecutándose</li>
              <li>Comprueba la configuración de IP en el archivo .env</li>
              <li>Ejecuta <code>node detect-ip.js</code> para detectar tu IP actual</li>
              <li>Reinicia ambos servidores (backend y frontend)</li>
            </ul>
          </div>
          <button
            onClick={fetchDashboardStats}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "15px"
            }}
          >
            🔄 Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Dashboard</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Información de debug (solo visible en desarrollo) */}
          {connectionInfo && (
            <div style={{
              fontSize: "11px",
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #e5e7eb"
            }}>
              API: {connectionInfo.apiURL}
            </div>
          )}
          <span style={{
            fontSize: "14px",
            color: connectionStatus === 'connected' ? '#10b981' : '#ef4444',
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}>
            {connectionStatus === 'connected' ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      {stats && (
        <div style={{ marginBottom: "20px", textAlign: "center", color: "#6b7280" }}>
          📊 Estadísticas del {formatDate(stats.fecha_actual)}
        </div>
      )}

      <div className="grid">
        <Card>
          <h4>Total Alumnos</h4>
          <h1>{stats?.total_alumnos || 0}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
            👥 Alumnos registrados
          </p>
        </Card>

        <Card>
          <h4>Asistencias Hoy</h4>
          <h1 style={{ color: "green" }}>{stats?.asistencias_hoy.presentes || 0}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
            ✅ Estudiantes presentes
          </p>
        </Card>

        <Card>
          <h4>Retardos</h4>
          <h1 style={{ color: "#ca8a04" }}>{stats?.asistencias_hoy.retardos || 0}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
            ⏰ Llegadas tarde
          </p>
        </Card>

        <Card>
          <h4>Faltas</h4>
          <h1 style={{ color: "#dc2626" }}>{stats?.asistencias_hoy.faltas || 0}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
            ❌ Ausencias
          </p>
        </Card>
      </div>

      {/* Gráficas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        {/* Gráfica de Pastel - Distribución General */}
        <Card>
          <h4 style={{ marginBottom: "20px", textAlign: "center" }}>Distribución de Asistencias</h4>
          <div style={{ height: "300px", width: "100%", minWidth: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gráfica de Barras - Por Grados */}
        <Card>
          <h4 style={{ marginBottom: "20px", textAlign: "center" }}>Asistencias por Grado</h4>
          <div style={{ height: "300px", width: "100%", minWidth: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grado" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="presentes" stackId="a" fill="#10b981" name="Presentes" />
                <Bar dataKey="retardos" stackId="a" fill="#f59e0b" name="Retardos" />
                <Bar dataKey="faltas" stackId="a" fill="#ef4444" name="Faltas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabla de resumen por grados */}
      <div style={{ marginTop: "30px" }}>
        <Card>
          <h4 style={{ marginBottom: "20px" }}>Resumen por Grados</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Grado</th>
                <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>Total Alumnos</th>
                <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e5e7eb", color: "#10b981" }}>Presentes</th>
                <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e5e7eb", color: "#f59e0b" }}>Retardos</th>
                <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e5e7eb", color: "#ef4444" }}>Faltas</th>
                <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>% Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {stats?.distribucion_grados.map((grado, index) => {
                const totalRegistros = grado.presentes + grado.retardos + grado.faltas;
                const porcentaje = totalRegistros > 0 ? ((grado.presentes + grado.retardos) / totalRegistros * 100).toFixed(1) : '0.0';

                return (
                  <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px", fontWeight: "600" }}>{grado.grado || 'Sin grado'}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{grado.total_alumnos}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#10b981", fontWeight: "600" }}>{grado.presentes}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#f59e0b", fontWeight: "600" }}>{grado.retardos}</td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#ef4444", fontWeight: "600" }}>{grado.faltas}</td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>{porcentaje}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      </div>
    </>
  );
};

export default Dashboard;
