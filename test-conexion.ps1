# Script para probar la conectividad del sistema
# Ejecuta este script para verificar que todo funciona correctamente

Write-Host "Probando conectividad del sistema de asistencia escolar..." -ForegroundColor Cyan
Write-Host ""

# Probar localhost
Write-Host "Probando localhost..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/asistencias/dashboard-stats" -Method GET -TimeoutSec 5
    Write-Host "OK - Localhost (http://localhost:3001)" -ForegroundColor Green
} catch {
    Write-Host "ERROR - Localhost: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar IP de red
Write-Host "Probando IP de red..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://192.168.101.110:3001/api/asistencias/dashboard-stats" -Method GET -TimeoutSec 5
    Write-Host "OK - Red (http://192.168.101.110:3001)" -ForegroundColor Green
} catch {
    Write-Host "ERROR - Red: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Para acceder desde tu celular:" -ForegroundColor Cyan
Write-Host "   1. Conecta tu celular a la misma red WiFi"
Write-Host "   2. Abre el navegador y ve a: http://192.168.101.110:5173"
Write-Host "   3. El sistema detectara automaticamente que usas la red"
Write-Host ""
Write-Host "Para desarrollo local:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:5173"
Write-Host "   - Backend: http://localhost:3001"