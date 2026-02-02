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

          {/* LOGO */}
          <Link to="/" className="landing-nav__logo">
            <img
              src="/src/assets/images/LOGO.jpg"
              alt="CRATE logo"
              className="landing-nav__logo-img"
            />
          </Link>
<<<<<<< Updated upstream

          {/* LINKS */}
          <div className="landing-nav-links">
            <a href="#about" className="landing-navlink">About</a>

            <button
              onClick={() => setIsLoginOpen(true)}
              className="landing-navlink landing-navlink--action"
            >
              Explorar álbumes
            </button>

            <Link to="/blog" className="landing-navlink">
              Blog
            </Link>
          </div>

          {/* AUTH BUTTONS */}
          <div className="landing-nav-buttons">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="landing-nav__btn landing-nav__btn--login"
=======
       <div className="landing-nav-buttons">
           
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="landing-nav__btn landing-nav__btn--signup"
>>>>>>> Stashed changes
            >
              Login
            </button>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="landing-nav__btn landing-nav__btn--register"
            >
              Registro
            </button>
             <button 
              onClick={() => setIsLoginOpen(true)}
              className="landing-nav__btn landing-nav__btn--signup"
            >
              Explorar
            </button>
          </div>

<<<<<<< Updated upstream
        </div>
      </nav>

      {/* MODALES */}
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
=======
      
      
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
>>>>>>> Stashed changes
  );
}
