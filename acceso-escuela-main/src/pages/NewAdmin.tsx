import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import Card from "../components/Card";
import "./NewAdmin.css"; 

const NewAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    nombre: "", 
    apellidoP: "", 
    apellidoM: "", 
    matricula: "", 
    password: "", 
    rol: "ADMIN" 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Cambio crítico: Usar el endpoint de personal
      // Si tu API usa la misma ruta de alumnos, asegúrate de enviar el ROL correcto
      const response = await axios.post(API_ENDPOINTS.PERSONAL_REGISTRAR, formData);
      
      if (response.status === 201) {
        alert("✅ Personal registrado con éxito");
        navigate("/admin/personal");
      }
    } catch (error: any) {
      alert("❌ Error: " + (error.response?.data?.mensaje || "No se pudo registrar"));
    }
  };

  return (
    <div className="new-admin-page-container">
      <div className="form-content-wrapper">
        <Link to="/admin/personal" className="back-link">
          ← Volver a personal
        </Link>

        <Card>
          <div className="form-header">
            <h2 className="form-title">Registrar Nuevo Administrador</h2>
            <p className="form-subtitle">Complete la información para el nuevo miembro del staff</p>
          </div>
          
          <form onSubmit={handleSubmit} className="new-admin-form">
            {/* Fila 1: Nombres y Apellidos */}
            <div className="form-grid-3">
              <div className="input-group">
                <label>Nombre(s)</label>
                <input type="text" placeholder="" required
                  onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Apellido Paterno</label>
                <input type="text" required
                  onChange={e => setFormData({...formData, apellidoP: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Apellido Materno</label>
                <input type="text" required
                  onChange={e => setFormData({...formData, apellidoM: e.target.value})} />
              </div>
            </div>

            {/* Fila 2: Matrícula y Rol */}
            <div className="form-grid-2">
              <div className="input-group">
                <label>ID Personal</label>
                <input type="text" placeholder="" required
                  onChange={e => setFormData({...formData, matricula: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Asignar Rol</label>
                <select value={formData.rol} 
                  onChange={e => setFormData({...formData, rol: e.target.value})}>
                  <option value="ADMIN">Administrador</option>
                  <option value="ENTRADA">Personal de Entrada</option>
                </select>
              </div>
            </div>

            {/* Fila 3: Contraseña */}
            <div className="form-grid-1">
              <div className="input-group">
                <label>Contraseña de Acceso</label>
                <input type="password" placeholder="" required
                  onChange={e => setFormData({...formData, password: e.target.value})} />
                <p className="input-helper">Esta clave permitirá al personal entrar al panel.</p>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save-admin">
                Finalizar Registro
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewAdmin;