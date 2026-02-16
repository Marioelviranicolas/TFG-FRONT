import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { apiFetch } from '../../api';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatarUrl: ''
  }); 

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      
      if (!currentUser) {
        navigate('/');
        return;
      }

      const response = await apiFetch(`/user/username/${currentUser.username}`);
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
        setErrors({ 
          general: `La imagen es demasiado grande (${fileSizeMB}MB). El tamaño máximo permitido es 5MB.` 
        });
        e.target.value = '';
        return;
      }
      
      setErrors({});
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    try {
      setUploadingImage(true);
      
      const formDataImage = new FormData();
      formDataImage.append('file', imageFile);

      // Para subir archivos usamos fetch normal pero añadimos el token manualmente
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `http://localhost:9001/user/username/${formData.username}/foto`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // NO pongas Content-Type aquí, el navegador lo gestiona solo con FormData
          },
          body: formDataImage
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const result = await response.json();
      return result.foto;

    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ general: 'Error al subir la imagen: ' + error.message });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      ...formData,
      avatarUrl: ''
    });
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

      let newAvatarUrl = formData.avatarUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        }
      }

      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      
      const getUserResponse = await apiFetch(`/user/username/${currentUser.username}`);
      const fullUser = await getUserResponse.json();
      
      const dataToSend = {
        idUser: fullUser.idUser,
        username: formData.username,
        email: formData.email,
        bio: formData.bio || null,
        avatarUrl: newAvatarUrl || null,
        role: fullUser.role
      };

      console.log('Datos que se envían:', dataToSend);

      const response = await apiFetch('/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (result === 1) {
        const updatedUser = {
          idUser: fullUser.idUser,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          avatarUrl: newAvatarUrl,
          role: fullUser.role
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
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

  const getAvatarPreview = () => {
    if (imagePreview) {
      return imagePreview;
    }
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

      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '30px',
        borderBottom: '2px solid #FF6B35',
        paddingBottom: '10px'
      }}>
        Editar Perfil
      </h1>

      <form onSubmit={handleSubmit}>
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
            <div style={{ 
              position: 'relative',
              width: '120px',
              height: '120px'
            }}>
              <img 
                src={getAvatarPreview()}
                alt="Avatar preview"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #FF6B35'
                }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${formData.username}&size=120&background=FF6B35&color=fff`;
                }}
              />
              {uploadingImage && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem'
                }}>
                  Subiendo...
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ 
                marginBottom: '15px', 
                color: '#666',
                fontSize: '0.9rem'
              }}>
                Sube una imagen de perfil
              </p>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label
                  htmlFor="avatar-upload"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}
                >
                  {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={saving || uploadingImage}
                  style={{ display: 'none' }}
                />
                
                {imageFile && (
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    {imageFile.name}
                  </span>
                )}
              </div>

              {(imageFile || formData.avatarUrl) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={saving || uploadingImage}
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

              <p style={{ 
                marginTop: '10px',
                fontSize: '0.75rem',
                color: '#999'
              }}>
                Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
              </p>
            </div>
          </div>
        </div>

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

        <div style={{ 
          display: 'flex', 
          gap: '15px',
          paddingTop: '20px',
          borderTop: '2px solid #ddd'
        }}>
          <button 
            type="button"
            onClick={() => navigate('/profile')}
            disabled={saving || uploadingImage}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: '#fff',
              color: '#666',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: (saving || uploadingImage) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>
          
          <button 
            type="submit"
            disabled={saving || uploadingImage}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: (saving || uploadingImage) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: (saving || uploadingImage) ? 0.6 : 1
            }}
          >
            {uploadingImage ? 'Subiendo imagen...' : saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}