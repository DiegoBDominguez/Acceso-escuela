import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api"; 
import Card from "../components/Card";
import "./NewAdmin.css"; 

const EditAdmin = () => {
  const { matricula: matriculaURL } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extraemos el objeto 'admin' que enviamos desde la tabla
  const adminData = location.state?.admin; 

 const [formData, setFormData] = useState({
  nombre: adminData?.nombre || "", 
  apellidoP: adminData?.apellido_paterno || "", // Uso de guion bajo de la DB
  apellidoM: adminData?.apellido_materno || "",
  nuevoId: adminData?.matricula || matriculaURL || "", 
  password: "", 
  rol: adminData?.rol || "ADMIN"
});

  // Este efecto llena los campos en cuanto detecta que adminData llegó
  useEffect(() => {
    if (adminData) {
      setFormData({
        nombre: adminData.nombre || "",
        // MAPEAMOS LOS NOMBRES DE TU SQL
        apellidoP: adminData.apellido_paterno || "", 
        apellidoM: adminData.apellido_materno || "",
        nuevoId: adminData.matricula || "",
        password: "",
        rol: adminData.rol || "ADMIN"
      });
    }
  }, [adminData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.PERSONAL_EDITAR(matriculaURL!), formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Información actualizada correctamente");
      navigate("/admin/personal");
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      alert(error.response?.data?.mensaje || "❌ Error al actualizar");
    }
  };

  return (
    <div className="new-admin-page-container">
      <div className="form-content-wrapper">
        <Link to="/admin/personal" className="back-link">← Volver a personal</Link>
        <Card>
          <h2 className="form-title">Editar Administrador</h2>
          <form onSubmit={handleSubmit} className="new-admin-form">
            <div className="form-grid-3">
              <div className="input-group">
                <label>Nombre(s)</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre} 
                  required
                  onChange={e => setFormData({...formData, nombre: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label>Apellido Paterno</label>
                <input 
                  type="text" 
                  value={formData.apellidoP} 
                  required
                  onChange={e => setFormData({...formData, apellidoP: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label>Apellido Materno</label>
                <input 
                  type="text" 
                  value={formData.apellidoM}
                  onChange={e => setFormData({...formData, apellidoM: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="input-group">
                <label>ID Personal (Matrícula)</label>
                <input 
                  type="text" 
                  value={formData.nuevoId} 
                  required
                  onChange={e => setFormData({...formData, nuevoId: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label>Asignar Rol</label>
                <select 
                  value={formData.rol} 
                  onChange={e => setFormData({...formData, rol: e.target.value})}
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="ENTRADA">Personal de Entrada</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Nueva Contraseña (dejar en blanco para no cambiar)</label>
              <input 
                type="password" 
                placeholder="******" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save-admin">Finalizar Edición</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditAdmin;