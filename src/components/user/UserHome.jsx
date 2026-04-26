import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowedReviews from '../user/FollowedReviews';
import UserSlideMenu from '../user/UserSlideMenu';
import Footer from '../layout/public/Footer';
import SearchBar from '../ui/SearchBar';
import RecommendedAlbums from '../user/RecommendedAlbums';
import EditorialSection from '../user/EditorialSection';
import FeaturedReviews from '../user/FeaturedReviews';
import './UserHome.css';

const UserHome = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(userData);
    }, []);

    if (!user) {
        return <div className="loading">Cargando...</div>;
    }

    const getGreeting = () => {
        return 'Bienvenido';
    };

    return (
        <>
        <div className='fondo-userhome'>
          <div className='userhome-header fade-in-section delay-1'>
            <div className='userhome-header-left'>
                <h1 className='title'>CRATE</h1>
                <p className='userhome-greeting'>
                    {getGreeting()}, <span className='userhome-greeting-name'>{user.username}</span>
                </p>
            </div>
            <SearchBar />
          </div>
        <div>
            <section className="fade-in-section delay-1">
                <FollowedReviews userId={user.idUser} />
            </section>
            <section className="fade-in-section delay-2">
                <RecommendedAlbums />
            </section>
            <section className="fade-in-section delay-3">
                <EditorialSection />
            </section>
            <section className="fade-in-section delay-4">
                <FeaturedReviews />
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
