import { Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { API_ENDPOINTS } from "../config/api"
import "./EntradaLayout.css"

interface AsistenciaResult {
  tipo: string
  estado: string
  nombre: string
  apellido: string
  hora: string
  fecha: string
}

const EntradaLayout = () => {
  const navigate = useNavigate()
  const [cameraActive, setCameraActive] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [asistenciaInfo, setAsistenciaInfo] = useState<AsistenciaResult | null>(null)
  const [procesando, setProcesando] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const startCamera = () => {
    setCameraActive(true)
  }

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setCameraActive(false)
    setScanSuccess(false)
  }

  // Procesar el escaneo y registrar asistencia
  const procesarEscaneo = async (token: string) => {
    setProcesando(true)
    try {
      const response = await fetch(API_ENDPOINTS.ASISTENCIAS_REGISTRAR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok && data.status === 200) {
        console.log("✅ Asistencia registrada:", data.datos)
        setAsistenciaInfo(data.datos)
        setScanSuccess(true)

        // Resetear después de 3 segundos
        setTimeout(() => {
          setScanSuccess(false)
          setAsistenciaInfo(null)
        }, 3000)
      } else {
        console.error("❌ Error al registrar:", data.mensaje)
        alert(`Error: ${data.mensaje}`)
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error)
      alert("Error al registrar asistencia")
    } finally {
      setProcesando(false)
    }
  }

  // Inicializar el escáner cuando cameraActive cambia a true
  useEffect(() => {
    if (!cameraActive || scannerRef.current) return

    // Esperar a que el DOM se actualice
    const timer = setTimeout(() => {
      if (!containerRef.current) {
        console.error("❌ Contenedor no encontrado")
        return
      }

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      )

      scanner.render(
        (decodedText) => {
          console.log("✅ QR escaneado:", decodedText)
          procesarEscaneo(decodedText)
        },
        (error) => {
          console.log("Error:", error)
        }
      )

      scannerRef.current = scanner
    }, 100)

    return () => clearTimeout(timer)
  }, [cameraActive])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  return (
    <div className="entrada-layout">

      {/* HEADER */}
      <header className="entrada-topbar">
        <h2>BIENVENIDO ENTRADA</h2>

        <button className="logout" onClick={() => navigate("/")}>
          SALIR
        </button>
      </header>

      {/* CONTENIDO */}
      <main className="entrada-main">
        <div className="entrada-container">
          <h3>Escanea QR de Alumno</h3>
          
          {/* BOTONES */}
          <div className="button-group">
            {!cameraActive ? (
              <button className="btn-start" onClick={startCamera}>
                 Activar Cámara
              </button>
            ) : (
              <button className="btn-stop" onClick={stopCamera} disabled={procesando}>
                 Detener Cámara
              </button>
            )}
          </div>

          {/* ESCÁNER QR */}
          {cameraActive && (
            <div className="scanner-container" ref={containerRef}>
              <div id="qr-reader"></div>
            </div>
          )}

          {/* RESULTADO DE ASISTENCIA */}
          {scanSuccess && asistenciaInfo && (
            <div className="scan-result success">
              <p>✅ {asistenciaInfo.tipo} REGISTRADA</p>
              <div className="asistencia-detail">
                <p><strong>{asistenciaInfo.nombre} {asistenciaInfo.apellido}</strong></p>
                <p>Estado: <span className={asistenciaInfo.estado === 'A TIEMPO' ? 'estado-bien' : 'estado-tarde'}>{asistenciaInfo.estado}</span></p>
                <p>Hora: <strong>{asistenciaInfo.hora}</strong></p>
                <p>Fecha: <strong>{asistenciaInfo.fecha}</strong></p>
              </div>
            </div>
          )}

          {procesando && (
            <div className="scan-info">
              <p>⏳ Procesando escaneo...</p>
            </div>
          )}
        </div>

        <Outlet />
      </main>

    </div>
  )
}

export default EntradaLayout
