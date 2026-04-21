import { useState } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '../../api';
import './AuthModals.css';


export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar username (mínimo 3 caracteres, sin espacios)
    if (formData.username.length < 3) {
      newErrors.username = 'El username debe tener al menos 3 caracteres';
    }
    if (/\s/.test(formData.username)) {
      newErrors.username = 'El username no puede contener espacios';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar password de momento esta puesto de 4 
    if (formData.password.length < 4 ) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      // Preparar datos para enviar (sin confirmPassword)
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
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        onSwitchToLogin();
      } else if (result === -1) {
        setErrors({ 
          username: 'Este username o email ya está en uso' 
        });
      } else {
        setErrors({ 
          general: 'Error al registrar. Inténtalo de nuevo.' 
        });
      }

    } catch (error) {
      setErrors({ 
        general: 'Error de conexión. Verifica que el servidor esté activo.' 
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Join CRATE</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Error general */}
          {errors.general && (
            <div className="error-message error-general">
              {errors.general}
            </div>
          )}

          {/* Username */}
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
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          {/* Email */}
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
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="modal-submit">
            Crear cuenta
          </button>
        </form>

        {/* Footer */}
        <div className="modal-footer">
          <p>
            Ya estas registrado?{' '}
            <button className="text-link" onClick={onSwitchToLogin}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}