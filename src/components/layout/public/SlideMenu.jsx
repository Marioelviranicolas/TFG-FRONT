import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SlideMenu.css";
import LoginModal from '../../auth/LoginModal';
import RegisterModal from '../../auth/RegisterModal';


export default function SlidingMenu() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [menuActive, setMenuActive] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);


  useEffect(() => {
    document.body.classList.toggle("menu-active", menuActive);
    return () => document.body.classList.remove("menu-active");
  }, [menuActive]);

  useEffect(() => {
    if (!menuActive) {
      setIsAccordionOpen(false);
    }
  }, [menuActive]);

  return (
    <>
      <nav id="slide-menu">
        <div className="slide-content">
        <ul>
          <p id="slideTitle">©Crate</p>
          <hr />
          <li href="#about" className="landing-slidelink">
            <span>Blog</span>
          </li>
          <hr />
          <li href="#about" className="landing-slidelink">
            <span>About</span>
          </li>
          <hr />


          {/* ACCORDION HEADER */}
          <li
            className="landing-slidelink accordion-header"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <span>Qué es Crate?</span>
            <span className={`accordion-arrow ${isAccordionOpen ? "open" : ""}`}>
              ▾
            </span>
          </li>

          {/* ACCORDION CONTENT */}
          <ul className={`accordion-content ${isAccordionOpen ? "open" : ""}`}>
            <li className="landing-subslidelink">
              <span>Funcionalidad</span>
            </li>
            <li className="landing-subslidelink">
              <span>Diseño</span>
            </li>
            <li className="landing-subslidelink">
              <span>Experiencia</span>
            </li>
          </ul>
            <hr></hr>
          <li onClick={() => setIsLoginOpen(true)} className="landing-slidelink landing-nav__btn--signup">
            <span>Explorar álbumes</span>
            </li>
            <hr></hr>
          <li onClick={() => setIsRegisterOpen(true)} className="landing-slidelink landing-nav__btn--signup">
            <span>Unirme</span>
            </li>
        </ul>
        </div>
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