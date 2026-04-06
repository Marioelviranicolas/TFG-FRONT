// src/perfil/edit/EditProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { apiFetch } from '../../../api';
import UserSlideMenu from '../../user/UserSlideMenu';
import '../profile.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatarUrl: ''
  });

  const [errors, setErrors]         = useState({});
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { loadUserData(); }, []);

  const loadUserData = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      if (!currentUser) { navigate('/'); return; }
      const res      = await apiFetch(`/user/username/${currentUser.username}`);
      const userData = await res.json();
      setFormData({
        username:  userData.username,
        email:     userData.email,
        bio:       userData.bio || '',
        avatarUrl: userData.avatarUrl || ''
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      const mb = (file.size / 1024 / 1024).toFixed(2);
      setErrors({ general: `La imagen es demasiado grande (${mb}MB). Máximo 5MB.` });
      e.target.value = '';
      return;
    }
    setErrors({});
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;
    try {
      setUploadingImage(true);
      const formDataImage = new FormData();
      formDataImage.append('file', imageFile);
      const res = await apiFetch(
        `/user/username/${formData.username}/foto`,
        { method: 'POST', body: formDataImage }
      );
      if (!res.ok) throw new Error('Error al subir la imagen');
      const result = await res.json();
      return result.foto;
    } catch (error) {
      setErrors({ general: 'Error al subir la imagen: ' + error.message });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, avatarUrl: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.username.length < 3)
      newErrors.username = 'El username debe tener al menos 3 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Email inválido';
    if (formData.bio && formData.bio.length > 500)
      newErrors.bio = 'La bio no puede exceder 500 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      let newAvatarUrl = formData.avatarUrl;
      if (imageFile) {
        const uploaded = await uploadImageToCloudinary();
        if (uploaded) newAvatarUrl = uploaded;
      }
      const currentUser  = JSON.parse(sessionStorage.getItem('currentUser'));
      const fullUserRes  = await apiFetch(`/user/username/${currentUser.username}`);
      const fullUser     = await fullUserRes.json();
      const dataToSend   = {
        idUser:    fullUser.idUser,
        username:  formData.username,
        email:     formData.email,
        bio:       formData.bio || null,
        avatarUrl: newAvatarUrl || null,
        role:      fullUser.role
      };
      const res    = await apiFetch('/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      const result = await res.json();
      if (result === 1) {
        sessionStorage.setItem('currentUser', JSON.stringify({
          idUser:    fullUser.idUser,
          username:  formData.username,
          email:     formData.email,
          bio:       formData.bio,
          avatarUrl: newAvatarUrl,
          role:      fullUser.role
        }));
        navigate('/profile');
      } else {
        setErrors({ general: 'Error al actualizar el perfil. Código: ' + result });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const getAvatarPreview = () => {
    if (imagePreview) return imagePreview;
    if (formData.avatarUrl) return formData.avatarUrl;
    return `https://ui-avatars.com/api/?name=${formData.username}&size=200&background=ff5500&color=fff`;
  };

  if (loading) return (
    <div className="pp-shell">
      <nav className="pp-navbar">
        <span className="pp-navbar-logo">CRATE</span>
      </nav>
      <p className="pp-loading">Cargando…</p>
      <UserSlideMenu />
    </div>
  );

  return (
    <div className="pp-shell">
      <nav className="pp-navbar">
        <span className="pp-navbar-logo" onClick={() => navigate('/user-home')} style={{ cursor: 'pointer' }}>
          CRATE
        </span>
      </nav>

      <div className="pp-edit-layout">

        {/* ── PANEL IZQUIERDO ── */}
        <aside className="pp-edit-sidebar">
          <button className="pp-edit-sidebar-back" onClick={() => navigate('/profile')}>
            ← Volver al perfil
          </button>

          <div className="pp-edit-sidebar-avatar">
            <div className="pp-avatar-preview-wrap">
              <img
                src={getAvatarPreview()}
                alt="Preview"
                className="pp-edit-sidebar-img"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${formData.username}&size=200&background=ff5500&color=fff`;
                }}
              />
              {uploadingImage && (
                <div className="pp-avatar-uploading">Subiendo…</div>
              )}
            </div>

            <span className="pp-edit-sidebar-username">{formData.username}</span>

            <div className="pp-edit-sidebar-actions">
              <label htmlFor="avatar-upload" className="pp-btn-upload" style={{ textAlign: 'center' }}>
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
                <span className="pp-edit-sidebar-hint">{imageFile.name}</span>
              )}
              {(imageFile || formData.avatarUrl) && (
                <button
                  type="button"
                  className="pp-btn-remove"
                  onClick={handleRemoveImage}
                  disabled={saving || uploadingImage}
                >
                  <Trash2 size={14} />
                  Eliminar avatar
                </button>
              )}
              <span className="pp-edit-sidebar-hint">JPG, PNG, GIF · Máx 5MB</span>
            </div>
          </div>
        </aside>

        {/* ── PANEL DERECHO ── */}
        <main className="pp-edit-main">
          <div className="pp-edit-page">
            <h1 className="pp-edit-title">Editar perfil</h1>

            {errors.general && (
              <div className="pp-feedback pp-feedback--error">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="pp-edit-section">
                <p className="pp-edit-section-title">Información básica</p>

                <div className="pp-fields-row">
                  <div className="pp-field">
                    <label className="pp-label" htmlFor="username">Username *</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className={`pp-input ${errors.username ? 'pp-input--error' : ''}`}
                      value={formData.username}
                      onChange={handleChange}
                      required
                      disabled={saving}
                    />
                    {errors.username && <span className="pp-field-error">{errors.username}</span>}
                  </div>

                  <div className="pp-field">
                    <label className="pp-label" htmlFor="email">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`pp-input ${errors.email ? 'pp-input--error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={saving}
                    />
                    {errors.email && <span className="pp-field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="pp-field">
                  <label className="pp-label" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className={`pp-textarea ${errors.bio ? 'pp-textarea--error' : ''}`}
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={saving}
                    rows={6}
                    maxLength={500}
                    placeholder="Cuéntanos sobre tus gustos musicales…"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {errors.bio
                      ? <span className="pp-field-error">{errors.bio}</span>
                      : <span />
                    }
                    <span className="pp-field-hint">{formData.bio.length}/500</span>
                  </div>
                </div>
              </div>

              <div className="pp-form-actions">
                <button
                  type="button"
                  className="pp-btn-cancel"
                  onClick={() => navigate('/profile')}
                  disabled={saving || uploadingImage}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="pp-btn-save"
                  disabled={saving || uploadingImage}
                >
                  {uploadingImage ? 'Subiendo imagen…' : saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </main>

      </div>

      <UserSlideMenu />
    </div>
  );
}
