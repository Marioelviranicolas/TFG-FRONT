import LandingNav from '../../components/layout/public/LandingNavbar';
import TitleHome from '../../components/layout/public/TitleHome';
import heroBackground from '../../assets/images/Home-CrateDiggin.jpg';
import './Landing.css'

export default function Landing() {

    return (
    <div>
        <LandingNav />

        <div className="hero-background">
            <img 
                src={heroBackground}  // Usar la variable importada
                alt="Background" 
                className="hero-background__img"
                />
            </div>
        <TitleHome />
    </div>
    

    
    );
    
}