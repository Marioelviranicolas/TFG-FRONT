import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './AuthModals.css';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});

  try {
    const response = await fetch('http://localhost:9001/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });
    
    if (!response.ok) {
      setErrors({ general: 'Usuario o contraseña incorrectos' });
      return;
    }

    const data = await response.json();

    // Guardamos el token y el usuario por separado
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('currentUser', JSON.stringify(data.user));

    alert(`¡Bienvenido, ${data.user.username}!`);
    onClose();
    navigate('/user-home');

  } catch (error) {
    console.error('Error completo:', error);
    setErrors({ 
      general: 'Error de conexión. Verifica que el servidor esté activo.' 
    });
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Log in to CRATE</h2>
          <button className="modal-close" onClick={onClose} disabled={isLoading}>
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

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              disabled={isLoading}
              className={errors.username ? 'input-error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              disabled={isLoading}
              className={errors.password ? 'input-error' : ''}
            />
          </div>

          <button 
            type="submit" 
            className="modal-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Footer */}
        <div className="modal-footer">
          <p>
            No tienes cuenta?{' '}
            <button 
              className="text-link" 
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Registarse
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}