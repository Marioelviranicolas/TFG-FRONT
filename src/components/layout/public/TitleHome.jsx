import { useState } from 'react';
import { Link } from 'react-router-dom';
import './TitleHome.css'

export default function TitleHome() {

    return (
  <div className="title-home">
    <h1 className="title-home__title">
      Crate</h1>
    <p className="title-home__subtitle">
     <span className="highlight">Registra</span> los álbumes que has escuchado.
        <br />
        <span className="highlight">Descubre</span> nuevos a través de tu red.
        <br />
        <span className="highlight">Guarda</span> los que quieres explorar
    </p>
  </div>
);
}
