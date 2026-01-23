import Card from "../components/Card"
import { useEffect, useState, useRef } from "react"
import * as QRCode from "qrcode"
import { API_ENDPOINTS } from "../config/api"
import "./StudentQR.css"

const StudentQR = () => {
  const [qrToken, setQrToken] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState<string>("")
  const [qrImage, setQrImage] = useState<string>("")

  useEffect(() => {
    const obtenerQR = async () => {
      try {
        // Obtener ID del usuario del localStorage
        const usuarioData = localStorage.getItem("usuario")
        if (!usuarioData) {
          console.error("❌ Usuario no encontrado")
          setLoading(false)
          return
        }

        const usuario = JSON.parse(usuarioData)
        const usuarioId = usuario.id

        // Obtener token QR
        const response = await fetch(API_ENDPOINTS.ALUMNOS_QR(usuarioId))
        const data = await response.json()

        if (data.status === 200) {
          setQrToken(data.token)
          console.log("✅ Token QR obtenido:", data.token)
        }

        // Obtener datos del perfil para el nombre
        const responsePerfil = await fetch(API_ENDPOINTS.ALUMNOS_PERFIL(usuarioId))
        const dataPerfil = await responsePerfil.json()

        if (dataPerfil.status === 200) {
          setNombre(`${dataPerfil.data.nombre} ${dataPerfil.data.apellido_paterno}`)
        }
      } catch (error) {
        console.error("❌ Error obteniendo QR:", error)
      } finally {
        setLoading(false)
      }
    }

    obtenerQR()
  }, [])

  // Generar QR cuando el token esté disponible
  useEffect(() => {
    if (qrToken) {
      QRCode.toDataURL(qrToken, {
        width: 256,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then((url: string) => {
        console.log("✅ QR generado correctamente")
        setQrImage(url)
      }).catch((err: any) => {
        console.error("❌ Error al generar QR:", err)
      })
    }
  }, [qrToken])

  if (loading) {
    return (
      <Card>
        <h3>Mi Código QR</h3>
        <p>Cargando...</p>
      </Card>
    )
  }

  return (
    <Card>
      <h3>Mi Código QR</h3>

      <p>
        Presenta este código al ingresar y salir de la institución.
      </p>

      {qrImage ? (
        <div className="qr-container">
          <img src={qrImage} alt="Código QR" />
          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            {nombre}
          </p>
          <p style={{ fontSize: "11px", color: "#999", marginTop: "5px" }}>
            {qrToken.substring(0, 20)}...
          </p>
        </div>
      ) : (
        <div className="qr-placeholder">
          <span>⏳ Generando QR...</span>
        </div>
      )}

      <p style={{ fontSize: "13px", color: "#555", marginTop: "20px" }}>
        Este código es único y personal. No lo compartas.
      </p>
    </Card>
  )
}

export default StudentQR
