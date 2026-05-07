import { useState } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '../../api';
import './AuthModals.css';
import Button from '@/components/ui/ButtonVoxy';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Añadido estado de carga
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }
    if (/\s/.test(formData.username)) {
      newErrors.username = 'Sin espacios permitidos';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (formData.password.length < 4) {
      newErrors.password = 'Mínimo 4 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true); // Activar carga
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await apiFetch('/user/register', {
        method: 'POST',
        skipRedirect: true,
        body: JSON.stringify({
          username: dataToSend.username,
          email: dataToSend.email,
          password: dataToSend.password,
          bio: dataToSend.bio || null,
          role: 'USER'
        })
      });

      const result = await response.json();

    if (result === 1) {
    setSuccessMessage('¡Usuario registrado correctamente!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
      onSwitchToLogin();
    }, 2000);
    } else if (result === -1) {
        setErrors({ username: 'Este username o email ya está en uso' });
      } else {
        setErrors({ general: 'Error al registrar. Inténtalo de nuevo.' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión con el servidor.' });
    } finally {
      setIsLoading(false); // Desactivar carga
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Join CRATE</h2>
          <button className="modal-close" onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message error-general">{errors.general}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="manolo11"
              required
              disabled={isLoading}
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="manolo@gmail.com"
              required
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              required
              disabled={isLoading}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              required
              disabled={isLoading}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Contenedor del Botón Voxy */}
          <div style={{ marginTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button 
              color="#FF6B35" 
              hoverColor="#ff8c5a"
              textColor="white" 
              fontSize="1.1rem"
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear cuenta'}
            </Button>
          </div>
        </form>

        <div className="modal-footer">
          <p>
            ¿Ya estás registrado?{' '}
            <button className="text-link" onClick={onSwitchToLogin} disabled={isLoading}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
