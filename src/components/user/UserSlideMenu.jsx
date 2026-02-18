import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/layout/public/SlideMenu.css";

export default function UserSlideMenu() {
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    document.body.classList.toggle("menu-active", menuActive);
    return () => document.body.classList.remove("menu-active");
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
      <nav id="slide-menu">
        <div className="slide-content">
          <ul>
            <p id="slideTitle">©Crate</p>
            {currentUser && (
              <h1 id="slideUsername">
                {currentUser.username}
              </h1>
            )}
            <hr />

            <li
              className="landing-slidelink"
              onClick={() => navigate("/userhome")}
            >
              <span>Inicio</span>
            </li>
            <hr />

            <li
              className="landing-slidelink"
              onClick={() => navigate("/profile")}
            >
              <span>Mi perfil</span>
            </li>
            <hr />

            <li
              className="landing-slidelink"
              onClick={() => navigate("/explore-users")}
            >
              <span>Explorar usuarios</span>
            </li>
            <hr />

            {/* Accordion */}
            <li
              className="landing-slidelink accordion-header"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              <span>Mi actividad</span>
              <span className={`accordion-arrow ${isAccordionOpen ? "open" : ""}`}>
                ▾
              </span>
            </li>

            <ul className={`accordion-content ${isAccordionOpen ? "open" : ""}`}>
              <li
                className="landing-subslidelink"
                onClick={() => navigate("/my-reviews")}
              >
                <span>Mis reviews</span>
              </li>
              <li
                className="landing-subslidelink"
                onClick={() => navigate("/favorites")}
              >
                <span>Favoritos</span>
              </li>
            </ul>

            <hr />

            <li
              className="landing-slidelink"
              onClick={handleLogout}
            >
              <span>Cerrar sesión</span>
            </li>
          </ul>
        </div>
      </nav>

      <button
        className="menu-trigger"
        onClick={() => setMenuActive(!menuActive)}
      >
        {!menuActive ? (
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect x="4" y="4" width="20" height="20" stroke="black" strokeWidth="2" fill="none"/>
            <line x1="4" y1="10" x2="24" y2="10" stroke="black" strokeWidth="1.5"/>
            <line x1="4" y1="14" x2="24" y2="14" stroke="black" strokeWidth="1.5"/>
            <line x1="4" y1="18" x2="24" y2="18" stroke="black" strokeWidth="1.5"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28">
            <line x1="6" y1="6" x2="22" y2="22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </>
  );
}
