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
      <div className="landing-nav__container">
         <Link to="/" className="landing-nav__logo">
            <img 
              src="/src/assets/images/LOGO.jpg" 
              className="landing-nav__logo-img"
            />
          </Link>
        
        <div className="landing-nav-links">
          <a href="#about" className="landing-navlink">
            About
          </a>
          <a onClick={() => setIsLoginOpen(true)} className="landing-navlink landing-nav__btn--signup"
            >
              Explorar álbumes
            </a>
            <Link to="/blog" className="landing-navlink">
            Blog
          </Link>
        </div>

       <div className="landing-nav-buttons">
           
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="landing-nav__btn landing-nav__btn--signup"
            >
              Unirme
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