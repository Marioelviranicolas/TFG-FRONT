import { useNavigate } from 'react-router-dom';
import './EditorialSection.css';


import charliSabrinaImg from '../../assets/images/charli-sabrina.png';
import hyperpop from '../../assets/images/hyperpop.jpg';
import mkguee from '../../assets/images/mkguee.jpg';
import magdalenabay from '../../assets/images/magdalena-bay.jpg';
import shygirl from '../../assets/images/Shygirl.jpeg';
import stereomadness from '../../assets/images/stereo-madness.jpg';
import kendrick from '../../assets/images/kendrick.avif';
import thesmile from '../../assets/images/the-smile.jpeg';

const articles = {
  hero: {
    id: 1,
    tag: 'Especial',
    title: 'Charli XCX, Sabrina Carpenter y el año en que el pop volvió a tener dientes',
    desc: '2024 demostró que el mainstream puede ser extraño, irónico y brutalmente honesto al mismo tiempo. Repasamos cómo dos artistas redefinieron lo que significa arrasar en charts sin renunciar a nada.',
    img: charliSabrinaImg,
    readTime: '8 min',
  },
  featured: [
    {
      id: 2,
      tag: 'Tendencia',
      title: 'Por qué todo el mundo está escuchando hyperpop a las 3 de la mañana',
      desc: 'De 100 gecs a Frost Children: la generación Z ha convertido el caos sónico en su música de cabecera. El hyperpop ya no es un meme, es un estado de ánimo.',
      img: hyperpop,
      date: 'Hace 2 días',
      readTime: '5 min',
    },
    {
      id: 3,
      tag: 'Reseña',
      title: 'Mk.gee y el álbum de guitarra más raro que escucharás este año',
      desc: '"Two Star & The Dream Police" suena como si Radiohead y D\'Angelo se hubieran conocido en un sueño lúcido. Mk.gee lleva meses siendo el secreto mejor guardado de internet.',
      img: mkguee,
      date: 'Hace 3 días',
      readTime: '6 min',
    },
    {
      id: 4,
      tag: 'Perfil',
      title: 'Magdalena Bay: los arquitectos del pop más inteligente de la década',
      desc: 'Con "Imaginal Disk" han construido un universo propio donde la synth pop de los 80 se convierte en ciencia ficción emocional. Y apenas nadie sabe quiénes son todavía.',
      img: magdalenabay,
      date: 'Ayer',
      readTime: '7 min',
    },
  ],
  small: [
    {
      id: 5,
      tag: 'Descubrimiento',
      title: 'Shygirl y la nueva vanguardia del club británico',
      date: 'Hace 4 días',
      readTime: '4 min',
      img: shygirl,
    },
    {
      id: 6,
      tag: 'En vivo',
      title: 'La Mutant "se agita" con el funky de Stereo Madness',
      date: 'Hace 5 días',
      readTime: '3 min',
      img: stereomadness,
    },
    {
      id: 7,
      tag: 'Cultura',
      title: 'Cómo Kendrick Lamar ganó algo más que un beef en 2024',
      date: 'Hace 1 semana',
      readTime: '9 min',
      img: kendrick,
    },
    {
      id: 8,
      tag: 'Álbum',
      title: 'The Smile, Thom Yorke y el rock que no necesita demostrar nada',
      date: 'Hace 1 semana',
      readTime: '6 min',
      img: thesmile,
    },
  ],
};
const EditorialSection = () => {
  const navigate = useNavigate();

  return (
    <div className="editorial-root">
      <p className="editorial-section-label">Esta semana en Crate</p>

      {/* HERO */}
      <div className="editorial-hero-row">
        <div className="editorial-hero-img">
          <img src={articles.hero.img} alt={articles.hero.title} />
        </div>
        <div className="editorial-hero-card">
          <span className="editorial-small-tag">{articles.hero.tag}</span>
          <h2 className="editorial-hero-title">{articles.hero.title}</h2>
          <p className="editorial-desc">{articles.hero.desc}</p>
          {/*<span className="editorial-read">{articles.hero.readTime} de lectura →</span>*/}
        </div>
      </div>

      {/* GRID 3 CARDS */}
      <div className="editorial-grid">
        {articles.featured.map(article => (
          <div key={article.id} className="editorial-card">
            <div className="editorial-img-wrap">
              <img src={article.img} alt={article.title} />
              <span className="editorial-tag">{article.tag}</span>
            </div>
            <div className="editorial-body">
              <p className="editorial-meta">{article.date} · {article.readTime}</p>
              <h3 className="editorial-title">{article.title}</h3>
              <p className="editorial-desc">{article.desc}</p>
              {/*<span className="editorial-read">Leer historia →</span>*/}
            </div>
          </div>
        ))}
      </div>

      {/* SMALL CARDS */}
      <div className="editorial-small-grid">
        {articles.small.map(article => (
          <div key={article.id} className="editorial-small-card">
            <div className="editorial-small-img">
              <img src={article.img} alt={article.title} />
            </div>
            <div className="editorial-small-body">
              <span className="editorial-small-tag">{article.tag}</span>
              <p className="editorial-small-title">{article.title}</p>
              <p className="editorial-small-meta">{article.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorialSection;