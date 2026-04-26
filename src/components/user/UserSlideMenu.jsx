import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter } from 'react-icons/fa';
import "./UserSlideMenu.css";

export default function UserSlideMenu() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [menuActive, setMenuActive] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const getAvatarUrl = () => {
    if (!currentUser) return "";
    if (currentUser.avatarUrl) return currentUser.avatarUrl;
    return `https://ui-avatars.com/api/?name=${currentUser.username}&size=200&background=FF6B35&color=fff`;
  };

  useEffect(() => {
    document.body.classList.toggle("user-menu-active", menuActive);
    return () => document.body.classList.remove("user-menu-active");
  }, [menuActive]);

  useEffect(() => {
    if (!menuActive) setIsAccordionOpen(false);
  }, [menuActive]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  const go = (path) => { navigate(path); setMenuActive(false); };

  return (
    <>
      <nav id="user-slide-menu">
        <div className="user-slide-content">

          {/* LEFT — Avatar + Username */}
          <div className="user-header-left">
            <div className="user-avatar-container">
              <img src={getAvatarUrl()} alt={currentUser?.username || "User"} />
            </div>
            {currentUser && <p id="userSlideUsername">{currentUser.username}</p>}
          </div>

          {/* CENTER-RIGHT — Links */}
          <ul>
            <li className="user-slidelink" onClick={() => go("/user-home")}>
              <span>INICIO</span>
            </li>
            <li className="user-slidelink" onClick={() => go(`/profile/${currentUser?.username}`)}>
              <span>MI PERFIL</span>
            </li>
            <li className="user-slidelink" onClick={() => go("/explore-albums")}>
              <span>EXPLORAR MÚSICA</span>
            </li>
            <li className="user-slidelink" onClick={() => go("/explore-users")}>
              <span>EXPLORAR USUARIOS</span>
            </li>

            {/* Solo visible para admins */}
            {currentUser?.role === 'ADMIN' && (
              <li className="user-slidelink user-slidelink--admin" onClick={() => go("/admin")}>
                <span>PANEL ADMIN</span>
              </li>
            )}

            <li className="user-slidelink" onClick={handleLogout}>
              <span>LOG OUT</span>
            </li>

            {/* BOTTOM — Social */}
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

      <button className="user-menu-trigger" onClick={() => setMenuActive(!menuActive)}>
        {!menuActive ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="user-icon-crate">
            <rect x="4" y="4" width="20" height="20" stroke="white" strokeWidth="2" fill="none"/>
            <line x1="4" y1="10" x2="24" y2="10" stroke="white" strokeWidth="1.5"/>
            <line x1="4" y1="14" x2="24" y2="14" stroke="white" strokeWidth="1.5"/>
            <line x1="4" y1="18" x2="24" y2="18" stroke="white" strokeWidth="1.5"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="user-icon-close">
            <line x1="6" y1="6" x2="22" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </>
  );
}
