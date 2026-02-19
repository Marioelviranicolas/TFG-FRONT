// src/components/layout/public/LandingNav.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingNavbar.css';

export default function LandingNav() {
 
 

  return (
      <>
          <Link to="/" className="landing-nav__logo">
          <h1 className="title-navbar">
          CRATE</h1>
          </Link>
    </>
  );
}
