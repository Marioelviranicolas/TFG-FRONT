import { Link } from 'react-router-dom';
import { useState } from 'react';
import './AboutUs.css';
import SlideMenu from './SlideMenu';
import Footer from './Footer';
import RegisterModal from '../../auth/RegisterModal';
import Team from '@/assets/images/Team.jpg';

import aboutbackground from '@/assets/images/AboutUs.jpg';

export default function AboutUs() {
   const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    return (
        <>
         <SlideMenu />
        <section className="sectionAbout">
             <div className="about-background">
                      <img
                        src={aboutbackground}
                        alt="Background"
                        className="about-background__img"
                      />
                    </div>
            <div className='header-about'>
                <h1>About us</h1>
            </div>
        </section>
        <section className='sectionTeam'>
          <div className='contenedor-team'>
            <h2 className='header-team'>Nuestro Team</h2>
            <p className='content-team'> Somos un grupo de amigos que nos cansamos de perder la cuenta de cuántos álbumes 
                habíamos escuchado, de olvidar recomendaciones que nos daban, y de tener conversaciones 
                del tipo <em>"¿cómo se llamaba ese disco que me pasaste hace dos años?"</em></p>
            <hr></hr>
            <p className='content-team'>
                Spotify tiene nuestras playlists. Instagram tiene nuestras fotos. 
                Letterboxd tiene las películas que vemos. Pero <strong>¿dónde guardamos nuestra 
                colección de álbumes?</strong> ¿Dónde llevamos el registro de lo que realmente 
                nos ha marcado musicalmente?
            </p>
            <hr></hr>
             <p className='content-team'>
                Así nació <strong>CRATE</strong> de la necesidad de tener nuestro propio espacio 
                para coleccionar, descubrir y compartir álbumes completos. Sin algoritmos que nos 
                digan qué escuchar. Sin playlists infinitas que nos distraigan. Solo música que importa, 
                compartida por personas reales.
              </p>
            <img src={Team} alt="" className='team-img' />
          </div>
          <div className='recomend-about'>
          <h2 className='recomend-header'>¿Para qué leer más?</h2>
          <p className='recomend-content'> Podríamos escribir tres párrafos más explicándote que CRATE es una plataforma 
                donde puedes archivar álbumes, crear listas, seguir a gente con tu mismo gusto, 
                escribir reseñas, descubrir joyas ocultas...
          </p>
          <p className='recomend-content'>
                Pero, <strong>¿para qué contártelo cuando puedes comprobarlo tú mismo?</strong> Regístrate ahora, explora algunos álbumes, añade tus favoritos, lee lo que 
                otros están escuchando. En 5 minutos entenderás por qué CRATE es diferente.
                La mejor forma de entender CRATE es <em>usándolo</em>.
          </p>
          <button 
                onClick={() => setIsRegisterOpen(true)}
                className="register-btn"
              >
                <span>Regístrate gratis</span>
              </button>
          </div>
          
        </section>
        <RegisterModal 
          isOpen={isRegisterOpen} 
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {}}
        />
         <Footer />
        </>
    );
}