import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter } from 'react-icons/fa';
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

  const handleOpenLogin = () => {
    setMenuActive(false);
    setIsLoginOpen(true);
  };
 
  const handleOpenRegister = () => {
    setMenuActive(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
      <nav id="slide-menu">
        <div className="slide-content">
          <p className="slideTitle">
            <Link to="/">
            <span>©CRATE</span>
            </Link>
            </p>
        <ul>
          <li href="#about" className="landing-slidelink">
            <span>BLOG</span>
          </li>
          <li href="#" className="landing-slidelink">
             <Link to="/about">
            <span>ABOUT</span>
            </Link>
          </li>
          <li href="#about" className="landing-slidelink">
            <span>CONTACTO</span>
          </li>
          <li onClick={handleOpenLogin} className="landing-slidelink landing-nav__btn--signup">
            <span>LOG IN</span>
            </li>
          <li onClick={handleOpenRegister} className="landing-slidelink landing-nav__btn--signup">
            <span>REGISTER</span>
            </li>
        <div className="social-section-SlideMenu">
          <h3 className="social-sectionTitle">Follow Us</h3>
            <h5 className="social-sectionTitle3">crate@crate.com</h5>
             <div className="social-icons-SlideMenu">
              <a href="https://instagram.com" className="social-icon-SlideMenu" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                 <FaInstagram />
                </a>
              <a href="https://linkedin.com" className="social-icon-SlideMenu" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn />
                </a>
              <a href="https://youtube.com" className="social-icon-SlideMenu" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
                </a>
              <a href="https://twitter.com" className="social-icon-SlideMenu" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
                </a>
            </div>
        </div>
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
            <rect x="4" y="4" width="20" height="20" stroke="white" strokeWidth="2" fill="none"/>
            <line x1="4" y1="10" x2="24" y2="10" stroke="white" strokeWidth="1.5"/>
            <line x1="4" y1="14" x2="24" y2="14" stroke="white" strokeWidth="1.5"/>
            <line x1="4" y1="18" x2="24" y2="18" stroke="white" strokeWidth="1.5"/>
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
            <line x1="6" y1="6" x2="22" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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