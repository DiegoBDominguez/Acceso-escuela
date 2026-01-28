# install-adb-windows.ps1
# Descarga e instala Android Platform Tools (ADB) en C:\platform-tools y añade al PATH de usuario.
# Ejecutar en PowerShell como Administrador o como usuario (setx modifica PATH de usuario).

$ErrorActionPreference = 'Stop'

$downloadUrl = 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'
$zipPath = Join-Path $env:TEMP 'platform-tools.zip'
$tempExtract = Join-Path $env:TEMP 'platform-tools-temp'
$installDir = 'C:\platform-tools'

Write-Host "Descargando Platform Tools desde: $downloadUrl" -ForegroundColor Cyan
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

if (Test-Path $tempExtract) { Remove-Item -Recurse -Force $tempExtract }
Expand-Archive -Path $zipPath -DestinationPath $tempExtract -Force

# El ZIP contiene una carpeta "platform-tools"
$extractedDir = Join-Path $tempExtract 'platform-tools'
if (-Not (Test-Path $extractedDir)) {
    Write-Error "No se encontró la carpeta 'platform-tools' dentro del ZIP. Extracción fallida."
    exit 1
}

if (Test-Path $installDir) {
    Write-Host "La carpeta $installDir ya existe. Se eliminará y reemplazará." -ForegroundColor Yellow
    try { Remove-Item -Recurse -Force $installDir } catch { Write-Warning ("No se pudo eliminar ${installDir}: " + $_) }
}

Move-Item -Path $extractedDir -Destination $installDir

# Añadir a PATH del usuario usando setx (no requiere elevación para el usuario actual)
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike '*C:\platform-tools*') {
    Write-Host "Añadiendo C:\platform-tools al PATH de usuario..." -ForegroundColor Cyan
    $newPath = "$currentPath;C:\platform-tools"
    setx PATH "$newPath" | Out-Null
    Write-Host "PATH de usuario actualizado. Cierra y abre la terminal para aplicar los cambios." -ForegroundColor Green
} else {
    Write-Host "C:\platform-tools ya está en el PATH de usuario." -ForegroundColor Green
}

# Limpieza
Remove-Item -Path $zipPath -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $tempExtract -ErrorAction SilentlyContinue

Write-Host "Instalación completada. Para verificar, abre una nueva PowerShell y ejecuta: adb devices" -ForegroundColor Green
Write-Host "Si usas Windows Defender / firewall, asegúrate de permitir conexiones USB si tu dispositivo lo requiere." -ForegroundColor Yellow
