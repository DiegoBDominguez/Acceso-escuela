import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "./Personal.css"; 

const Personal = () => {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener lista completa desde MySQL
  const obtenerPersonal = async () => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await axios.get(API_ENDPOINTS.PERSONAL_LISTA, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (respuesta.data) {
        setPersonal(respuesta.data);
      }
    } catch (error) {
      console.error("Error al obtener personal:", error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar registro
  const eliminarPersonal = async (matricula: string) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario con ID: ${matricula}?`)) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(API_ENDPOINTS.PERSONAL_ELIMINAR(matricula), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert("🗑️ Registro eliminado correctamente");
        obtenerPersonal(); 
      } catch (error: any) {
        console.error("Error al eliminar:", error.response?.data || error);
        alert(error.response?.data?.mensaje || "❌ No se pudo eliminar el registro");
      }
    }
  };

  // Redirigir a edición pasando el objeto completo
  const editarPersonal = (admin: any) => {
    console.log("Mandando a editar:", admin);
    navigate(`/admin/personal/edit/${admin.matricula}`, { state: { admin } });
  };

  useEffect(() => {
    obtenerPersonal();
  }, []);

  return (
    <div className="personal-container">
      <div className="header-section">
        <h2 className="title">Gestión de Personal</h2>
        <button 
          onClick={() => navigate("/admin/personal/new")}
          className="btn-add-personal"
        >
          + Nuevo Administrador
        </button>
      </div>

      <Card>
        {loading ? (
          <p className="loading-text">Cargando personal...</p>
        ) : personal.length === 0 ? (
          <p className="no-data">No hay personal registrado.</p>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Personal</th>
                  <th>Nombre Completo</th>
                  <th>Rol</th>
                  <th>Fecha de Registro</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {personal.map((admin) => (
                  <tr key={admin.matricula}>
                    <td className="bold-text">{admin.matricula}</td>
                    <td>{admin.nombreCompleto}</td>
                    <td>
                      <span className={`role-badge ${admin.rol.toLowerCase()}`}>
                        {admin.rol}
                      </span>
                    </td>
                    <td>{admin.fecha}</td> 
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          onClick={() => editarPersonal(admin)}
                          className="btn-action edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => eliminarPersonal(admin.matricula)}
                          className="btn-action delete"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Personal;