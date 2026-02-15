import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowedReviews from '../user/FollowedReviews';
import './UserHome.css';

const UserHome = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        console.log('Usuario desde localStorage:', userData);
        console.log('idUser:', userData?.idUser);
        setUser(userData);
    }, []);

    if (!user) {
        return <div className="loading">Cargando...</div>;
    }

    console.log('Pasando userId a FollowedReviews:', user.idUser);
    
    return (
        <div className="user-home">
            <header className="user-home-header">
                <div className="user-welcome">
                    <h1>Bienvenido, {user.username}!</h1>
                    
                    <button onClick={() => navigate('/profile')}>
                        Ver mi perfil
                    </button>
                    <button onClick={()=> navigate ('/explore-users')}>
                        Explorar usuarios
                    </button>
                </div>
                
              {/* {user.avatarUrl && (
                    <img 
                        src={user.avatarUrl} 
                        alt={user.username}
                        className="user-avatar"
                    />
                )}
              */}
            </header>

            {/* Reviews de las personas que sigues */}
            <section className="reviews-section">
                <FollowedReviews userId={user.idUser} />
            </section>

            {/* Aquí puedes añadir más secciones */}
            {/* 
            <section className="albums-section">
                <h2>Álbumes populares</h2>
            </section>
            
            <section className="my-reviews-section">
                <h2>Mis reviews</h2>
            </section>
            */}
        </div>
    );
};

export default UserHome;