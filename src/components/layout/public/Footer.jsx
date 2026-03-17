import React, { useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter } from 'react-icons/fa';
import Footerlogo from '../../../assets/images/LOGO-DEMO.jpg';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes añadir la lógica para enviar el email
    console.log('Email suscrito:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Section: Logo */}
        <div className="footer-logo-section">
          <img 
          src={Footerlogo}
          alt="CRATE Logo" 
          className="footer-logo" />
        </div>

        {/* Right Section */}
        <div className="footer-right">
          {/* Social Media & Newsletter */}
          <div className="social-newsletter">
            <div className="social-section-footer">
              <h3 className="title-footer-section">Follow Us</h3>
              <div className="social-icons-footer">
                <a href="https://instagram.com" className="social-icon-footer" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" className="social-icon-footer" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn />
                </a>
                <a href="https://youtube.com" className="social-icon-footer" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                  <FaYoutube />
                </a>
                <a href="https://twitter.com" className="social-icon-footer" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
              </div>
            </div>

            
            <div class="card">
              <span class="card__title">Newsletter</span>
              <p class="card__content">
                ¿No sabes qué escuchar? Deja que nosotros decidamos tu nueva personalidad musical esta semana.
              </p>
              <form class="card__form">
                <input required="" type="email" placeholder="Ultimos lanzamientos" />
                <button class="card__button">Click me</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Links */}
      <div className="footer-bottom">
        <a href="#community" className="footer-link">Music Community</a>
        <a href="#careers" className="footer-link">Careers</a>
        <a href="#privacy" className="footer-link">Privacy Policy</a>
        <a href="#terms" className="footer-link">Terms of Service</a>
      </div>
    </footer>
  );
};

