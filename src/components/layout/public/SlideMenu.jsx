import { useState, useEffect } from "react";
import "./SlideMenu.css";
import LoginModal from '../../auth/LoginModal';
import RegisterModal from '../../auth/RegisterModal';

export default function SlidingMenu() {
  const [menuActive, setMenuActive] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-active", menuActive);
    return () => document.body.classList.remove("menu-active");
  }, [menuActive]);

  return (
    <>
      <nav id="slide-menu">
        <ul>
          <li href="#about" className="landing-navlink">
            Blog
          </li>
          <li href="#about" className="landing-navlink">
            About
          </li>
          <li className="calendar">Calendar</li>
          <li onClick={() => setIsLoginOpen(true)} className="landing-navlink landing-nav__btn--signup">
            Explorar álbumes
            </li>
          <li onClick={() => setIsRegisterOpen(true)} className="landing-navlink landing-nav__btn--signup">
            Unirme
            </li>
        </ul>
      </nav>

        <button
        className="menu-trigger"
        onClick={() => setMenuActive(!menuActive)}
      >
        {!menuActive ? (
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 28 28" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="icon-crate"
          >
            <rect x="4" y="4" width="20" height="20" stroke="black" strokeWidth="2" fill="none"/>
            <line x1="4" y1="10" x2="24" y2="10" stroke="black" strokeWidth="1.5"/>
            <line x1="4" y1="14" x2="24" y2="14" stroke="black" strokeWidth="1.5"/>
            <line x1="4" y1="18" x2="24" y2="18" stroke="black" strokeWidth="1.5"/>
          </svg>
        ) : (
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 28 28" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="icon-close"
          >
            <line x1="6" y1="6" x2="22" y2="22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
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
