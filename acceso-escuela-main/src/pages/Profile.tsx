import Card from "../components/Card"

const Profile = () => {
  return (
    <>
      <h2>Mi Perfil</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
}}>
        <Card>
          <div style={{
            height: "260px",
            background: "#dbeafe",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "#2563eb"
          }}>
            FOTO
          </div>
        </Card>

        <Card>
          <h3>Información Personal</h3>
          <p><strong>Nombre:</strong> Alumno Ejemplo</p>
          <p><strong>Grupo:</strong> 3° A</p>
          <p><strong>Turno:</strong> Matutino</p>
          <p><strong>Estado:</strong> Activo</p>
          <p><strong>Matrícula:</strong> 202235779</p>
          <p><strong>Correo Institucional:</strong> alumno@escuela.edu.mx</p>


        </Card>
      </div>
    </>
  )
}

export default Profile
