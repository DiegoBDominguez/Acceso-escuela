// Configuración inteligente de URLs
// Detecta automáticamente si estamos en localhost o en red externa

// Función para detectar si estamos accediendo desde localhost
const isLocalhost = () => {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
};

// Función para obtener la IP del servidor backend
const getServerIP = () => {
  // Si estamos en localhost, usar localhost para el backend
  if (isLocalhost()) {
    return 'localhost';
  }
  // Si estamos en red externa, usar la IP de la red local
  return '192.168.101.110';
};

const API_PORT = '3001';

// URL base de la API - se adapta automáticamente
const getBaseURL = () => {
  // Primero intentar desde variable de entorno (.env)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Detectar automáticamente la URL apropiada
  const serverIP = getServerIP();
  return `http://${serverIP}:${API_PORT}`;
};

// URL base de la API
export const API_BASE_URL = getBaseURL();

// Función de utilidad para probar conectividad
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
    });
    return response.ok;
  } catch (error) {
    console.warn('Error de conexión con la API:', error);
    return false;
  }
};

// Información de debug
export const getConnectionInfo = () => {
  return {
    isLocalhost: isLocalhost(),
    serverIP: getServerIP(),
    apiURL: API_BASE_URL,
    frontendURL: window.location.origin
  };
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  UPLOADS_URL: `${API_BASE_URL}`,
  ALUMNOS_QR: (usuarioId: string) => `${API_BASE_URL}/api/alumnos/qr/${usuarioId}`,
  ALUMNOS_LISTA: `${API_BASE_URL}/api/alumnos/lista`, 
  ALUMNOS_REGISTRO: `${API_BASE_URL}/api/alumnos/registro`,
  ALUMNOS_PERFIL: (usuarioId: string) => `${API_BASE_URL}/api/alumnos/perfil/${usuarioId}`,
  ASISTENCIAS_REGISTRAR: `${API_BASE_URL}/api/asistencias/registrar`,
  ASISTENCIAS_MIS_ASISTENCIAS: (usuarioId: string) => `${API_BASE_URL}/api/asistencias/mis-asistencias/${usuarioId}`,
  ASISTENCIAS_MIS_ASISTENCIAS_SEMANALES: (usuarioId: string) => `${API_BASE_URL}/api/asistencias/mis-asistencias-semanales/${usuarioId}`,
  ASISTENCIAS_ADMIN: `${API_BASE_URL}/api/asistencias/admin`,
  ASISTENCIAS_DASHBOARD_STATS: `${API_BASE_URL}/api/asistencias/dashboard-stats`,
  
  // Endpoints de Personal
  PERSONAL_REGISTRAR: `${API_BASE_URL}/api/personal/registrar`,
  PERSONAL_LISTA: `${API_BASE_URL}/api/personal/lista`,
  PERSONAL_EDITAR: (matricula: string) => `${API_BASE_URL}/api/personal/editar/${matricula}`,
  
  // AGREGAMOS ESTA LÍNEA PARA ELIMINAR:
  PERSONAL_ELIMINAR: (matricula: string) => `${API_BASE_URL}/api/personal/eliminar/${matricula}`,
  
  // Configuraciones
  SETTINGS_GET: `${API_BASE_URL}/api/settings`,
  SETTINGS_UPDATE: `${API_BASE_URL}/api/settings`,
  
  // Días no laborables
  NON_WORKING_DAYS_GET: `${API_BASE_URL}/api/non-working-days`,
  NON_WORKING_DAYS_ADD: `${API_BASE_URL}/api/non-working-days`,
  NON_WORKING_DAYS_REMOVE: (fecha: string) => `${API_BASE_URL}/api/non-working-days/${fecha}`,
  
  // Reportes
  REPORTS_GET: `${API_BASE_URL}/api/reports`,
};
