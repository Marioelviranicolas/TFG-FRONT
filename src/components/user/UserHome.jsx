import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowedReviews from '../user/FollowedReviews';
import UserSlideMenu from '../user/UserSlideMenu';
import './UserHome.css';

const UserHome = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Cambiado de localStorage a sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('currentUser'));
        console.log('Usuario desde sessionStorage:', userData);
        
        if (!userData) {
            // Si no hay usuario, mandamos al login
            navigate('/');
            return;
        }
        
        setUser(userData);
    }, []);

    if (!user) {
        return <div className="loading">Cargando...</div>;
    }
    
    return (
        <>

        <UserSlideMenu />

        <div className="user-home">
            <header className="user-home-header">
                <div className="user-welcome">
                    <h1>Bienvenido, {user.username}</h1>
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
        </div>
        </>
    );
};

export default UserHome;