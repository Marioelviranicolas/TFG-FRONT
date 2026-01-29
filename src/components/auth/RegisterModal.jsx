import { useState } from 'react';
import { X } from 'lucide-react';
import './AuthModals.css';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: ''
    });

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: Implementar tu llamada al backend
    console.log('Register data:', formData);
    
    // Ejemplo:
    // try {
    //   const response = await fetch('http://localhost:8080/api/auth/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    //   });
    //   const data = await response.json();
    //   localStorage.setItem('token', data.token);
    //   window.location.href = '/feed';
    // } catch (error) {
    //   console.error('Register error:', error);
    // }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Sign up for CRATE</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
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
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="modal-submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}