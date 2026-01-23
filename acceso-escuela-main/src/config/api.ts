// Configuración centralizada de URLs
// Para celular en la misma red: http://192.168.101.112:3001

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.101.112:3001';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  ALUMNOS_QR: (usuarioId: string) => `${API_BASE_URL}/api/alumnos/qr/${usuarioId}`,
  ALUMNOS_PERFIL: (usuarioId: string) => `${API_BASE_URL}/api/alumnos/perfil/${usuarioId}`,
  ASISTENCIAS_REGISTRAR: `${API_BASE_URL}/api/asistencias/registrar`,
  ASISTENCIAS_MIS_ASISTENCIAS: (usuarioId: string) => `${API_BASE_URL}/api/asistencias/mis-asistencias/${usuarioId}`,
};
