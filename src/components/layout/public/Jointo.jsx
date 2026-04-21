import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Jointo.css';
import RegisterModal from '../../auth/RegisterModal';
import joinBackground from '@/assets/images/Home-CrateDiggin3.jpg';
import Button from '@/components/ui/ButtonVoxy';

export default function Jointo() {
     const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    return (
        <>
        
        <section className="sectionJointo">
             <div className="join-background">
                      <img
                        src={joinBackground}
                        alt="Background"
                        className="join-background__img"
                      />
                    </div>
            <div className='header-jointo'>
                <h1>Te quieres unir a crate?</h1>
            </div>
        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="landing-nav__btn landing-nav__btn--register"
          color="#FF6B35" 
          outlineColor="#000000"
          fontFamily = 'ClashDisplay-semibold'
          textColor = '#ffffff'
        >
          Empieza ahora
        </Button>
        </section>
        <RegisterModal 
            isOpen={isRegisterOpen} 
            onClose={() => setIsRegisterOpen(false)}
            onSwitchToLogin={() => {}}
            />
        </>
    );
}