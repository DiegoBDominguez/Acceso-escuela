import Card from "../components/Card"

const Settings = () => {
  return (
    <Card>
      <h2>Configuración</h2>

      <label>Hora oficial de entrada</label>
      <input type="time" />

      <label>Tolerancia de retardo (minutos)</label>
      <input type="number" placeholder="Ej. 10" />
    </Card>
  )
}

export default Settings
