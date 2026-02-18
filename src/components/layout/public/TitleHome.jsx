import { useState } from 'react';
import RegisterModal from '../../auth/RegisterModal';
import LoginModal from '../../auth/LoginModal';
import './TitleHome.css';

export default function TitleHome() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <div className="title-home">
      <p className="title-home-title">
        Your music collection.
          <br />
      </p>
        <p className="title-home__subtitle">
          <span className="highlight">Registra</span> los álbumes que has escuchado.
          <br />
          <span className="highlight">Descubre</span> nuevos a través de tu red.
          <br />
          <span className="highlight">Guarda</span> los que quieres explorar
        </p>
      <div className='btn-title-home'>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="landing-nav__btn landing-nav__btn--register"
        >
          Empieza ahora
        </button>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="landing-nav__btn landing-nav__btn--login"
        >
          Entrar
        </button>
      </div>
      </div>
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
