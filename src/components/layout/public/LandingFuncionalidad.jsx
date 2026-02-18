import { Link } from 'react-router-dom';
import './LandingFuncionalidad.css';

export default function Funcionalidad() {
    return (
        <>
        <section className="contenedor">
            <div className='header'>
                <h1>Funcionalidad</h1>
            </div>
            <div className='cards'>
                <div className="funcionalidad-card">
                    <h1 className='funcionalidad-title'>Biblioteca</h1>
                    <p>Guarda y organiza tus álbumes favoritos. Lleva el control de lo que escuchas y crea tu colección personal.</p>
                </div>
                <div className="funcionalidad-card">
                    <h1 className='funcionalidad-title' >Comunidad</h1>
                    <p>Comparte tus opiniones musicales con amigos. Conecta y comenta sus reviews.</p>
                </div>
                <div className="funcionalidad-card">
                    <h1 className='funcionalidad-title'>Listas</h1>
                    <p>Diseña listas temáticas para cada momento. Compártelas con tu comunidad y
                    descubre las colecciones de otros usuarios.</p>
                </div>
                <div className="funcionalidad-card">
                    <h1 className='funcionalidad-title'>Reseñas</h1>
                    <p>Escribe reseñas a tu ritmo, profundas como un crítico profesional o pensamientos rápidos.</p>
                </div>
            </div>
        </section>
        </>
    );
}