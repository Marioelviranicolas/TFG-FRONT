import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowedReviews from '../user/FollowedReviews';
import UserSlideMenu from '../user/UserSlideMenu';
import Footer from '../layout/public/Footer';
import SearchBar from '../ui/SearchBar';
import RecommendedAlbums from '../user/RecommendedAlbums';
import EditorialSection from '../user/EditorialSection';
import './UserHome.css';

const UserHome = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Cambiado de localStorage a sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('currentUser'));
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
        <div className='fondo-userhome'>
          <div className='userhome-header'>
            <h1 className='title'>CRATE</h1>
            <SearchBar />
          </div>
        <div>
            {/* Reviews de las personas que sigues */}
            <section>
                <FollowedReviews 
                userId={user.idUser} 
                />
            </section>
            <section>
                <RecommendedAlbums />
            </section>
            <section>
                <EditorialSection />
            </section>
        </div>
         </div>
        <UserSlideMenu />
        <div>
        <Footer />
        </div>
         </>
    );
};

export default UserHome;