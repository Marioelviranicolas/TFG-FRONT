// src/components/layout/public/LandingNav.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../../auth/LoginModal';
import RegisterModal from '../../auth/RegisterModal';
import './LandingNavbar.css';

export default function LandingNav() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);


  return (
    <>
    <nav className="landing-nav">
        <div className="landing-nav__tagline">
        Your music collection
        </div>

      <div className="landing-nav__container">
        <Link to="/" className="landing-nav__title">
          <h1 >CRATE</h1>
        </Link>
        
        <div className="landing-nav-links">
          <a href="#about" className="landing-navlink">
            About
          </a>
          <Link to="/blog" className="landing-navlink">
            Blog
          </Link>
          <a href="#philosophy" className="landing-navlink">
            Philosophy
          </a>
        </div>

       <div className="landing-nav-buttons">
            {/* Cambiar Links por buttons */}
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="landing-nav__btn landing-nav__btn--login"
            >
              Log in
            </button>
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="landing-nav__btn landing-nav__btn--signup"
            >
              Sign up
            </button>
          </div>
      </div>
    </nav>

      {/* Modales */}
      <LoginModal 
      isOpen={isLoginOpen} 
      onClose={() => setIsLoginOpen(false)}
      onSwitchToRegister={() => setIsRegisterOpen(true)}
    />
    <RegisterModal 
      isOpen={isRegisterOpen} 
      onClose={() => setIsRegisterOpen(false)}
      onSwitchToLogin={() => setIsLoginOpen(true)}
    />
  </>
  );
}