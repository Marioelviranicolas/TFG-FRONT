import LandingNav from '../../components/layout/public/LandingNavbar';
import TitleHome from '../../components/layout/public/TitleHome';
import heroBackground from '../../assets/images/Home-CrateDiggin.jpg';
import SlideMenu from '../../components/layout/public/SlideMenu';
import Funcionalidad from '../../components/layout/public/LandingFuncionalidad';
import './Landing.css'
import ReviewsStepper from '../../components/layout/public/ReviewsStepper';
import Footer from '../../components/layout/public/Footer';

export default function Landing() {
return (
    <>
      <SlideMenu />

      {/* ESTE es el content que se mueve */}
      <div id="content">
        <LandingNav />

        <div className="hero-background">
          <img
            src={heroBackground}
            alt="Background"
            className="hero-background__img"
          />
        </div>

        <TitleHome />
      </div>
      <div>
        <Funcionalidad />
      </div>
      <div className='stepper-component'>
        <ReviewsStepper />
      </div>
      <div>
        <Funcionalidad />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}