import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExploreUsers.css';

const UserCarousel = ({ title, users, userStats }) => {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        carouselRef.current.scrollBy({ left: -820, behavior: 'smooth' });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({ left: 820, behavior: 'smooth' });
    };

    return (
        <section className="carousel-section">
            <div className="carousel-header">
                <h2 className="carousel-title">{title}</h2>
            </div>

            <div className="carousel-outer">
                <button className="carousel-btn" onClick={scrollLeft}>←</button>

                <div className="carousel-wrapper" ref={carouselRef}>
                    <div className="carousel-track">
                        {users.map((user) => {
                            const stats = userStats[user.username] || {};
                            return (
                                <div className="user-card" key={user.idUser}>
                                    <div className="user-card__avatar">
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.username} />
                                        ) : (
                                            <div className="user-card__avatar-placeholder">
                                                {user.username.slice(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="user-card__username">{user.username}</h3>
                                    <p className="user-card__bio">{user.bio || 'Sin biografía'}</p>
                                    <div className="user-card__stats">
                                        <div className="stat">
                                            <span className="stat__value">{stats.reviews ?? 0}</span>
                                            <span className="stat__label">Reviews</span>
                                        </div>
                                        <div className="stat-divider" />
                                        <div className="stat">
                                            <span className="stat__value">{stats.lists ?? 0}</span>
                                            <span className="stat__label">Listas</span>
                                        </div>
                                        <div className="stat-divider" />
                                        <div className="stat">
                                            <span className="stat__value">{stats.followers ?? 0}</span>
                                            <span className="stat__label">Seguidores</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="carousel-btn" onClick={scrollRight}>→</button>
            </div>
        </section>
    );
};

const ExploreUsers = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [topReviewers, setTopReviewers] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [userStats, setUserStats] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const fetchStats = async (users) => {
        const stats = {};
        await Promise.all(
            users.map(async (user) => {
                if (stats[user.username]) return; // evita llamadas duplicadas
                const [reviewsRes, listsRes, followersRes] = await Promise.all([
                    fetch(`http://localhost:9001/reviews/user/${user.username}`),
                    fetch(`http://localhost:9001/soundlist/user/${user.username}`),
                    fetch(`http://localhost:9001/follow/followers/${user.username}`)
                ]);
                const [reviews, lists, followers] = await Promise.all([
                    reviewsRes.json(),
                    listsRes.json(),
                    followersRes.json()
                ]);
                stats[user.username] = {
                    reviews: reviews.length,
                    lists: lists.length,
                    followers: followers.length
                };
            })
        );
        return stats;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topRes, reviewersRes, ratedRes] = await Promise.all([
                    fetch('http://localhost:9001/follow/top-users'),
                    fetch('http://localhost:9001/user/top-reviewers'),
                    fetch('http://localhost:9001/user/top-rated')
                ]);
                const [topData, reviewersData, ratedData] = await Promise.all([
                    topRes.json(),
                    reviewersRes.json(),
                    ratedRes.json()
                ]);

                const filteredTop = topData.filter(u => u.username !== currentUser?.username);
                const filteredReviewers = reviewersData.filter(u => u.username !== currentUser?.username);
                const filteredRated = ratedData.filter(u => u.username !== currentUser?.username);

                setTopUsers(filteredTop);
                setTopReviewers(filteredReviewers);
                setTopRated(filteredRated);

                // Juntamos todos los usuarios únicos para hacer las llamadas de stats de una vez
                const allUsers = [...new Map(
                    [...filteredTop, ...filteredReviewers, ...filteredRated].map(u => [u.username, u])
                ).values()];

                const stats = await fetchStats(allUsers);
                setUserStats(stats);
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

            <UserCarousel
                title="Usuarios destacados"
                users={topUsers}
                userStats={userStats}
            />

            <UserCarousel
                title="Usuarios más activos"
                users={topReviewers}
                userStats={userStats}
            />

            <UserCarousel
                title="Mejores valoraciones"
                users={topRated}
                userStats={userStats}
            />
        </div>
    );
};

export default ExploreUsers;