# Sistema de Control de Asistencia Escolar

Un sistema completo de gestión de asistencia escolar con soporte para acceso desde PC y dispositivos móviles.

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
# Backend
cd backend-escuela
npm install

# Frontend
cd ../acceso-escuela-main
npm install
```

### 2. Iniciar servidores

```bash
# Terminal 1 - Backend
cd backend-escuela
npm start

# Terminal 2 - Frontend
cd ../acceso-escuela-main
npm run dev
```

### 3. Verificar funcionamiento

Ejecuta el script de prueba:
```bash
.\test-conexion.ps1
```

## 📱 Acceso desde diferentes dispositivos

### Desde PC (Desarrollo Local)
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **API:** Se conecta automáticamente a localhost

### Desde PC/Red Local
- **Frontend:** http://192.168.101.110:5173
- **Backend:** http://192.168.101.110:3001
- **API:** Se conecta automáticamente a la IP de red

### Desde Celular
1. Conecta tu celular a la misma red WiFi que tu PC
2. Abre el navegador y ve a: `http://192.168.101.110:5173`
3. El sistema detectará automáticamente que estás en red y configurará la API

## 🔧 Configuración de Red

El sistema está configurado para funcionar automáticamente en diferentes entornos:

- **Detección automática:** El frontend detecta si estás accediendo desde localhost o red externa
- **Configuración flexible:** Puedes forzar una URL específica editando el archivo `.env`
- **Multi-interfaz:** El backend escucha en todas las interfaces de red

### Archivo de configuración (.env)

```env
# Configuración automática (recomendado)
# El sistema detecta automáticamente la URL apropiada

# O forzar URL específica (opcional)
# VITE_API_URL=http://192.168.101.110:3001
```

## 🛠️ Características

- ✅ Control de asistencia con QR
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Filtros por día de la semana
- ✅ Calendario de días no laborables
- ✅ Acceso desde PC y móvil
- ✅ Configuración automática de red
- ✅ Gráficos interactivos con Recharts

## 🐛 Solución de Problemas

### Error de conexión
1. Verifica que ambos servidores estén ejecutándose
2. Ejecuta `.\test-conexion.ps1` para verificar conectividad
3. Revisa que tu IP sea `192.168.101.110` (ejecuta `ipconfig` en CMD)

### Problemas con el celular
1. Asegúrate de que el celular esté en la misma red WiFi
2. Verifica que puedas acceder a `http://192.168.101.110:5173`
3. Si no funciona, verifica la IP de tu PC con `ipconfig`

## 📊 Dashboard

El dashboard muestra:
- Total de alumnos registrados
- Asistencias del día (presentes, retardos, faltas)
- Distribución por grados
- Gráficos interactivos

## 🔐 Usuarios de Prueba

- **Admin:** Credenciales configuradas en la base de datos
- **Alumno:** Acceso mediante QR generado

## 🗄️ Base de Datos

- **Motor:** MySQL
- **Tablas principales:** usuarios, alumnos, asistencias, qr_tokens
- **Configuración:** Archivo `backend-escuela/src/config/db.js`