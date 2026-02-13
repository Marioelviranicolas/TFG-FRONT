// src/components/user/EditProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function EditProfileModal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatarUrl: ''
  }); 

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser) {
        navigate('/');
        return;
      }

      const response = await fetch(`http://localhost:9001/user/username/${currentUser.username}`);
      const userData = await response.json();

      setFormData({
        username: userData.username,
        email: userData.email,
        bio: userData.bio || '',
        avatarUrl: userData.avatarUrl || ''
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'El username debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'La bio no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Obtener el usuario completo del backend
      const getUserResponse = await fetch(`http://localhost:9001/user/username/${currentUser.username}`);
      const fullUser = await getUserResponse.json();
      
      // Crear objeto LIMPIO solo con los campos necesarios
      const dataToSend = {
        idUser: fullUser.idUser,
        username: formData.username,
        email: formData.email,
        password: fullUser.password,
        bio: formData.bio || null,
        avatarUrl: formData.avatarUrl || null,
        role: fullUser.role,
        createdAt: fullUser.createdAt
      };

      console.log('Datos que se envían:', dataToSend);

      const response = await fetch('http://localhost:9001/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Response status:', response.status);

      const result = await response.json();
      console.log('Result:', result);

      if (result === 1) {
        // Actualizar localStorage
        const updatedUser = {
          idUser: fullUser.idUser,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          avatarUrl: formData.avatarUrl,
          role: fullUser.role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        alert('¡Perfil actualizado correctamente!');
        navigate('/profile');
      } else {
        setErrors({ general: 'Error al actualizar el perfil. Código: ' + result });
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Error de conexión: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData({
      ...formData,
      avatarUrl: ''
    });
  };

  const getAvatarPreview = () => {
    if (formData.avatarUrl) {
      return formData.avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${formData.username}&size=150&background=FF6B35&color=fff`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Botón volver */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <ArrowLeft size={20} />
          Volver al perfil
        </button>
      </div>

      {/* Título */}
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '30px',
        borderBottom: '2px solid #FF6B35',
        paddingBottom: '10px'
      }}>
        ⚙️ Editar Perfil
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Error general */}
        {errors.general && (
          <div style={{ 
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            {errors.general}
          </div>
        )}

        {/* SECCIÓN: AVATAR */}
        <div style={{ 
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px'
        }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            color: '#333'
          }}>
            Avatar
          </h2>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            {/* Preview del avatar */}
            <img 
              src={getAvatarPreview()}
              alt="Avatar preview"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #FF6B35'
              }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${formData.username}&size=120&background=FF6B35&color=fff`;
              }}
            />

            <div style={{ flex: 1 }}>
              <p style={{ 
                marginBottom: '10px', 
                color: '#666',
                fontSize: '0.9rem'
              }}>
                URL de tu imagen de perfil
              </p>
              
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/avatar.jpg"
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />

              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666'
                  }}
                >
                  <Trash2 size={16} />
                  Eliminar avatar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN: INFORMACIÓN BÁSICA */}
        <div style={{ 
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px'
        }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            color: '#333'
          }}>
            Información Básica
          </h2>

          {/* Username */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="username"
              style={{ 
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.username ? '2px solid #f44' : '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            {errors.username && (
              <span style={{ 
                display: 'block',
                marginTop: '5px',
                color: '#c33', 
                fontSize: '0.875rem' 
              }}>
                {errors.username}
              </span>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="email"
              style={{ 
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.email ? '2px solid #f44' : '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            {errors.email && (
              <span style={{ 
                display: 'block',
                marginTop: '5px',
                color: '#c33', 
                fontSize: '0.875rem' 
              }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="bio"
              style={{ 
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={saving}
              rows="5"
              maxLength="500"
              placeholder="Cuéntanos sobre tus gustos musicales..."
              style={{
                width: '100%',
                padding: '12px',
                border: errors.bio ? '2px solid #f44' : '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '5px'
            }}>
              {errors.bio && (
                <span style={{ color: '#c33', fontSize: '0.875rem' }}>
                  {errors.bio}
                </span>
              )}
              <span style={{ 
                marginLeft: 'auto',
                fontSize: '0.875rem', 
                color: '#666' 
              }}>
                {formData.bio.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          paddingTop: '20px',
          borderTop: '2px solid #ddd'
        }}>
          <button 
            type="button"
            onClick={() => navigate('/profile')}
            disabled={saving}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: '#fff',
              color: '#666',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>
          
          <button 
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}