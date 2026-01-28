import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { API_ENDPOINTS } from "../config/api";
import Card from "../components/Card";
import "./EntradaLayout.css";

const EntradaLayout = () => {
  const navigate = useNavigate();
  const [cameraActive, setCameraActive] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [asistenciaInfo, setAsistenciaInfo] = useState<any>(null);
  const [procesando, setProcesando] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Usamos useCallback para evitar la advertencia amarilla en el useEffect
  const procesarEscaneo = useCallback(async (token: string) => {
    if (procesando) return; // Evita múltiples escaneos simultáneos
    
    setProcesando(true);
    try {
      const response = await fetch(API_ENDPOINTS.ASISTENCIAS_REGISTRAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();

      if (response.ok && data.status === 200) {
        setAsistenciaInfo(data.datos);
        setScanSuccess(true);

        // Resetear el estado de éxito después de 4 segundos
        setTimeout(() => {
          setScanSuccess(false);
          setAsistenciaInfo(null);
        }, 4000);
      } else {
        alert(`Error: ${data.mensaje}`);
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      alert("Error al registrar asistencia");
    } finally {
      setProcesando(false);
    }
  }, [procesando]);

  const startCamera = () => setCameraActive(true);
  
  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setCameraActive(false);
    setScanSuccess(false);
  };

  // Inicializar el escáner
  useEffect(() => {
    if (!cameraActive) return;

    // Pequeño delay para asegurar que el div 'qr-reader' existe en el DOM
    const timer = setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } }, 
        false
      );

      scanner.render(
        (decodedText) => procesarEscaneo(decodedText),
        (_error) => { /* Silenciar errores de lectura constantes */ }
      );

      scannerRef.current = scanner;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [cameraActive, procesarEscaneo]); // Dependencias completas para Vite

  return (
    <div className="entrada-layout-bg">
      {/* Topbar unificada con el diseño de Administrador */}
      <header className="entrada-topbar">
        <div className="topbar-content">
          <h2>BIENVENIDO PERSONAL DE ENTRADA</h2>
          <button className="btn-cerrar-sesion" onClick={() => navigate("/")}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="entrada-main-content">
        <div className="centered-container">
          <Card>
            <div className="scanner-header">
              <h3 className="form-main-title">Escaneo de Asistencia</h3>
              <p className="subtitle">Coloque el código QR frente a la cámara</p>
            </div>

            <div className="button-group">
              {!cameraActive ? (
                <button className="btn-primary-large" onClick={startCamera}>
                  Activar Cámara de Entrada
                </button>
              ) : (
                <button className="btn-stop-large" onClick={stopCamera}>
                  Detener Cámara
                </button>
              )}
            </div>

            {cameraActive && (
              <div className="qr-wrapper">
                <div id="qr-reader"></div>
              </div>
            )}

            {/* Resultado visual del escaneo */}
            {scanSuccess && asistenciaInfo && (
              <div className="result-card-animation">
                <div className="success-banner">
                  ✅ {asistenciaInfo.tipo} REGISTRADA
                </div>
                <div className="student-info-box">
                  <h4 className="student-name">
                    {asistenciaInfo.nombre} {asistenciaInfo.apellido}
                  </h4>
                  <div className="info-grid-simple">
                    <p>Estado: <span className={asistenciaInfo.estado === 'A TIEMPO' ? 'tag-green' : 'tag-red'}>
                      {asistenciaInfo.estado}
                    </span></p>
                    <p>Hora: <strong>{asistenciaInfo.hora}</strong></p>
                  </div>
                </div>
              </div>
            )}

            {procesando && (
              <div className="loading-status">
                <span className="spinner"></span> Verificando registro...
              </div>
            )}
          </Card>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default EntradaLayout;