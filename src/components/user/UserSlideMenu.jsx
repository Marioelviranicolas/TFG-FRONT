import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSlideMenu.css";

export default function UserSlideMenu() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [menuActive, setMenuActive] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const getAvatarUrl = () => {
    if (!currentUser) return "";

    if (currentUser.avatarUrl) {
      return currentUser.avatarUrl;
    }

    return `https://ui-avatars.com/api/?name=${currentUser.username}&size=200&background=FF6B35&color=fff`;
  };

  useEffect(() => {
    document.body.classList.toggle("user-menu-active", menuActive);
    return () => document.body.classList.remove("user-menu-active");
  }, [menuActive]);

  useEffect(() => {
    if (!menuActive) {
      setIsAccordionOpen(false);
    }
  }, [menuActive]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <>
      <nav id="user-slide-menu">
        <div className="user-slide-content">
          <div className="user-avatar-container">
            <img 
              src={getAvatarUrl()}
              alt={currentUser?.username || "User"}
            />
          </div>
          {currentUser && (
            <p id="userSlideUsername">{currentUser.username}</p>
          )}
          <ul>
            <li className="user-slidelink" onClick={() => { navigate("/user-home"); setMenuActive(false); }}>
              <span>INICIO</span>
            </li>
            <li className="user-slidelink" onClick={() => { navigate(`/profile/${currentUser?.username}`); setMenuActive(false); }}>
              <span>MI PERFIL</span>
            </li>
            <li className="user-slidelink" onClick={() => { navigate("/explore-users"); setMenuActive(false); }}>
              <span>EXPLORAR USUARIOS</span>
            </li>
            <li
              className="user-slidelink"
              onClick={() => setIsAccordionOpen(prev => !prev)}
            >
              <span>MI ACTIVIDAD</span>
              <span className={`user-accordion-arrow ${isAccordionOpen ? 'open' : ''}`}>›</span>
            </li>
            {isAccordionOpen && (
              <>
                <li className="user-subslidelink" onClick={() => { navigate(`/profile/${currentUser?.username}`); setMenuActive(false); }}>
                  <span>Mis reviews</span>
                </li>
                <li className="user-subslidelink" onClick={() => { navigate(`/profile/${currentUser?.username}`); setMenuActive(false); }}>
                  <span>Favoritos</span>
                </li>
              </>
            )}
            <li className="user-slidelink" onClick={handleLogout}>
              <span>LOG OUT</span>
            </li>
          </ul>
        </div>
      </nav>
      
      <button
        className="user-menu-trigger"
        onClick={() => setMenuActive(!menuActive)}
      >
        {!menuActive ? (
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 28 28" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="user-icon-crate"
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
            className="user-icon-close"
          >
            <line x1="6" y1="6" x2="22" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </>
  );
}