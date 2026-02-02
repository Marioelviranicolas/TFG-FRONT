import { useState } from 'react';
import { X } from 'lucide-react';
import './AuthModals.css';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    const user = await response.json();

    if (user && user.username) {
      localStorage.setItem('currentUser', JSON.stringify({
        idUser: user.idUser,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role
      }));

      alert(`¡Bienvenido, ${user.username}!`);
      onClose();
      window.location.reload();

    } else {
      setErrors({ 
        general: 'Usuario o contraseña incorrectos' 
      });
    }

  } catch (error) {
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
              placeholder="manolo11"
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
              placeholder="Enter your password"
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
            Don't have an account?{' '}
            <button 
              className="text-link" 
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}