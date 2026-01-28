import { useState } from "react";
import axios from "axios";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api"; 
import Card from "../components/Card";
import "./NewAdmin.css"; 

const EditStudent = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const alumnoData = location.state?.alumno; 

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: alumnoData?.nombre || "", 
    apellidoP: alumnoData?.apellido_paterno || "", 
    apellidoM: alumnoData?.apellido_materno || "", 
    nuevaMatricula: alumnoData?.matricula || "", 
    grado: alumnoData?.grado || "1",
    grupo: alumnoData?.grupo || "A",
    turno: alumnoData?.turno || "MATUTINO",
    activo: alumnoData?.activo ?? 1,
    password: "",
    foto_url: alumnoData?.foto_url || "" 
  });

  // Estado para la previsualización de la imagen
  const [preview, setPreview] = useState(alumnoData?.foto_url || "");

  // Función para convertir la imagen seleccionada a Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejador del cambio de archivo (Foto)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await convertToBase64(file);
        setPreview(base64); // Actualiza la vista previa en el círculo azul
        setFormData(prev => ({ ...prev, foto_url: base64 })); // Guarda el string largo para el backend
      } catch (error) {
        console.error("Error al procesar la imagen", error);
      }
    }
  };

  // Envío del formulario al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Usamos PUT para actualizar el registro basado en el ID
      await axios.put(`${API_BASE_URL}/api/alumnos/editar/${id}`, formData);
      alert(`✅ Alumno ${formData.nombre} actualizado correctamente`);
      navigate("/admin/students"); 
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      alert(error.response?.data?.mensaje || "❌ Error al actualizar alumno");
    }
  };

  return (
    <div className="new-admin-page-container">
      <div className="form-content-wrapper">
        <Link to="/admin/students" className="back-link">← Volver a alumnos</Link>
        <Card>
          {/* TÍTULO DINÁMICO: Muestra el nombre del alumno que se está editando */}
          <h2 className="form-title">Editar Alumno: {formData.nombre}</h2>
          
          <form onSubmit={handleSubmit} className="new-admin-form">
            
            {/* SECCIÓN DE FOTO DE PERFIL */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ 
                width: '130px', 
                height: '130px', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: '3px solid #2563eb', 
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {preview ? (
                  <img src={preview} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sin foto</span>
                )}
              </div>
              <label style={{ marginTop: '10px', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                📷 Seleccionar nueva foto
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </div>

            {/* DATOS PERSONALES */}
            <div className="form-grid-3">
              <div className="input-group">
                <label>Nombre(s)</label>
                <input type="text" value={formData.nombre} required onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Apellido Paterno</label>
                <input type="text" value={formData.apellidoP} required onChange={e => setFormData({...formData, apellidoP: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Apellido Materno</label>
                <input type="text" value={formData.apellidoM} onChange={e => setFormData({...formData, apellidoM: e.target.value})} />
              </div>
            </div>

            {/* DATOS ACADÉMICOS */}
            <div className="form-grid-3">
              <div className="input-group">
                <label>Matrícula</label>
                <input type="text" value={formData.nuevaMatricula} required onChange={e => setFormData({...formData, nuevaMatricula: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Grado</label>
                <select value={formData.grado} onChange={e => setFormData({...formData, grado: e.target.value})}>
                  <option value="1">1°</option>
                  <option value="2">2°</option>
                  <option value="3">3°</option>
                </select>
              </div>
              <div className="input-group">
                <label>Grupo</label>
                <select value={formData.grupo} onChange={e => setFormData({...formData, grupo: e.target.value})}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            {/* CONFIGURACIÓN DE CUENTA */}
            <div className="form-grid-2">
              <div className="input-group">
                <label>Turno</label>
                <select value={formData.turno} onChange={e => setFormData({...formData, turno: e.target.value})}>
                  <option value="MATUTINO">Matutino</option>
                  <option value="VESPERTINO">Vespertino</option>
                </select>
              </div>
              <div className="input-group">
                <label>Estado de Cuenta</label>
                <select value={formData.activo} onChange={e => setFormData({...formData, activo: parseInt(e.target.value)})}>
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Nueva Contraseña (dejar en blanco para no cambiar)</label>
              <input type="password" placeholder="******" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="form-actions" style={{ marginTop: '20px' }}>
              <button type="submit" className="btn-save-admin" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Guardar Cambios
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditStudent;