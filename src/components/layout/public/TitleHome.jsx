import { useState } from 'react';
import { Link } from 'react-router-dom';
import './TitleHome.css'

export default function TitleHome() {

    return (
  <div className="title-home">
    <h1 className="title-home__title">Crate</h1>
    <p className="title-home__subtitle">
    Registra los álbumes que has escuchado y
    descubre nuevos a través de tu red.
   
    </p>
  </div>
);
}
