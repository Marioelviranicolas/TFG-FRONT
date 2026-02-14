import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExploreUsers.css';

const UserCarousel = ({ title, users, followerCounts }) => {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <section className="carousel-section">
            <div className="carousel-header">
                <h2 className="carousel-title">{title}</h2>
                <div className="carousel-controls">
                    <button className="carousel-btn" onClick={scrollLeft}>←</button>
                    <button className="carousel-btn" onClick={scrollRight}>→</button>
                </div>
            </div>

            <div className="carousel-track" ref={carouselRef}>
                {users.map((user, index) => (
                    <div className="user-card" key={user.idUser}>

                        {/* FOTO - zona principal */}
                        <div className="user-card__avatar">
                            <span className="user-card__rank">#{index + 1}</span>
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.username} />
                            ) : (
                                <div className="user-card__avatar-placeholder">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* INFO - debajo */}
                        <div className="user-card__info">
                            <h3>@{user.username}</h3>
                            <p className="user-card__bio">
                                {user.bio || 'Sin biografía'}
                            </p>
                            <span className="user-card__followers">
                                <strong>{followerCounts[user.username] ?? 0}</strong> seguidores
                            </span>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
};

const ExploreUsers = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [followerCounts, setFollowerCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:9001/follow/top-users');
                const data = await res.json();

                const filtered = data.filter(u => u.username !== currentUser?.username);
                setTopUsers(filtered);

                const counts = {};
                await Promise.all(
                    filtered.map(async (user) => {
                        const r = await fetch(`http://localhost:9001/follow/followers/${user.username}`);
                        const followers = await r.json();
                        counts[user.username] = followers.length;
                    })
                );
                setFollowerCounts(counts);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="explore-loading">
                <div className="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="explore-page">
            <header className="explore-header">
                <button className="back-btn" onClick={() => navigate('/user-home')}>
                    ← Volver
                </button>
                <h1 className="explore-title">Explorar</h1>
            </header>

            {/* Carrusel 1: Usuarios más seguidos */}
            <UserCarousel
                title="Usuarios destacados"
                users={topUsers}
                followerCounts={followerCounts}
            />

            {/* Aquí puedes añadir más carruseles en el futuro */}
            {/* 
            <UserCarousel
                title="Nuevos usuarios"
                users={newUsers}
                followerCounts={followerCounts}
            />
            */}
        </div>
    );
};

export default ExploreUsers;
