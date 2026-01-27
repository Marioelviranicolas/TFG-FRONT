// src/components/layout/public/LandingNav.jsx
import { Link } from 'react-router-dom';
import './LandingNavbar.css';

export default function LandingNav() {
  return (
    
    <nav className="landing-nav">
        <div className="landing-nav__tagline">
        Your music collection
        </div>
      <div className="landing-nav__container">

        <Link to="/" className="landing-nav__title">
          <h1 >CRATE</h1>
        </Link>
        
        <div className="landing-nav-links">
          <a href="#about" className="landing-navlink">
            About
          </a>
          <Link to="/blog" className="landing-navlink">
            Blog
          </Link>
          <a href="#philosophy" className="landing-navlink">
            Philosophy
          </a>
        </div>

        <div className="landing-nav-buttons">
          <Link to="/login" className="landing-nav__btn landing-nav__btn--login">
            Log in
          </Link>
          <Link to="/register" className="landing-nav__btn landing-nav__btn--signup">
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}