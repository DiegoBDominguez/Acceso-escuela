// Configuración centralizada de URLs
// Opciones disponibles:
// - localhost: http://localhost:3001
// - IP local: http://172.31.5.242:3001

// Cambiar aquí según necesites
const API_URL_LOCALHOST = 'http://localhost:3001';
const API_URL_IP4 = 'http://172.31.5.242:3001';

// Por defecto en red local usar la IP para que el celular pueda alcanzar la API.
export const API_BASE_URL = import.meta.env.VITE_API_URL || API_URL_IP4;

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  UPLOADS_URL: `${API_BASE_URL}`,
  ALUMNOS_QR: (usuarioId: string) => `${API_BASE_URL}/api/alumnos/qr/${usuarioId}`,
  ALUMNOS_LISTA: `${API_BASE_URL}/api/alumnos/lista`, 
  ALUMNOS_REGISTRO: `${API_BASE_URL}/api/alumnos/registro`,
  ALUMNOS_PERFIL: (usuarioId: string) => `${API_BASE_URL}/api/alumnos/perfil/${usuarioId}`,
  ASISTENCIAS_REGISTRAR: `${API_BASE_URL}/api/asistencias/registrar`,
  ASISTENCIAS_MIS_ASISTENCIAS: (usuarioId: string) => `${API_BASE_URL}/api/asistencias/mis-asistencias/${usuarioId}`,
  
  // Endpoints de Personal
  PERSONAL_REGISTRAR: `${API_BASE_URL}/api/personal/registrar`,
  PERSONAL_LISTA: `${API_BASE_URL}/api/personal/lista`,
  PERSONAL_EDITAR: (matricula: string) => `${API_BASE_URL}/api/personal/editar/${matricula}`,
  
  // AGREGAMOS ESTA LÍNEA PARA ELIMINAR:
  PERSONAL_ELIMINAR: (matricula: string) => `${API_BASE_URL}/api/personal/eliminar/${matricula}`,
};
