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
              alt="CRATE logo"
              className="landing-nav__logo-img"
            />
          </Link>
          
          <div className="landing-nav-buttons">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="landing-nav__btn landing-nav__btn--login"
            >
              Login
            </button>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="landing-nav__btn landing-nav__btn--register"
            >
              Registro
            </button>
          </div>

        </div>
      </nav>

     
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
