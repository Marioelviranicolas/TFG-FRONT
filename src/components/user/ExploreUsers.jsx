import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import SearchBar from '../ui/SearchBar';
import Footer from '../layout/public/Footer';
import UserSlideMenu from './UserSlideMenu';
import './ExploreUsers.css';

// ─── Fila de portadas de álbumes ──────────────────────────────────────────────
const AlbumStrip = ({ username }) => {
    const [covers, setCovers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch(`/reviews/user/${username}`)
            .then(r => r.json())
            .then(data => {
                const urls = (data || [])
                    .filter(r => r.album?.coverUrl)
                    .slice(0, 6)
                    .map(r => ({ url: r.album.coverUrl, id: r.album.spotifyAlbumId }));
                setCovers(urls);
            })
            .catch(() => {});
    }, [username]);

    if (!covers.length) return <div className="album-strip album-strip--empty" />;

    return (
        <div className="album-strip">
            {covers.map((c, i) => (
                <img
                    key={i}
                    src={c.url}
                    alt=""
                    className="album-strip__cover"
                    onClick={e => { e.stopPropagation(); navigate(`/album/${c.id}`); }}
                />
            ))}
        </div>
    );
};

// ─── Tarjeta de usuario estilo Letterboxd ─────────────────────────────────────
const UserCard = ({ user, stats, currentUsername }) => {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [followersCount, setFollowersCount] = useState(stats.followers ?? 0);
    const isOwnCard = user.username === currentUsername;

    useEffect(() => {
        if (isOwnCard || !currentUsername) return;
        apiFetch(`/follow/status/${currentUsername}/${user.username}`)
            .then(r => r.json())
            .then(data => setIsFollowing(data))
            .catch(() => {});
    }, [user.username]);

    const handleFollow = async (e) => {
        e.stopPropagation();
        if (loadingFollow) return;
        setLoadingFollow(true);
        try {
            if (isFollowing) {
                await apiFetch(`/follow/${user.username}?followerUsername=${currentUsername}`, { method: 'DELETE' });
                setIsFollowing(false);
                setFollowersCount(c => Math.max(0, c - 1));
            } else {
                await apiFetch(`/follow/${user.username}?followerUsername=${currentUsername}`, { method: 'POST' });
                setIsFollowing(true);
                setFollowersCount(c => c + 1);
            }
        } catch {
        } finally {
            setLoadingFollow(false);
        }
    };

    const avatarUrl = user.avatarUrl
        || `https://ui-avatars.com/api/?name=${user.username}&size=200&background=e85d26&color=fff`;

    return (
        <div className="user-card" onClick={() => navigate(`/profile/${user.username}`)}>
            <img
                className="user-card__avatar"
                src={avatarUrl}
                alt={user.username}
                onError={e => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.username}&size=200&background=e85d26&color=fff`;
                }}
            />
            <h3 className="user-card__username">{user.username}</h3>
            <p className="user-card__meta">
                <span>{stats.reviews ?? 0} reviews</span>
                <span className="user-card__dot">·</span>
                <span>{followersCount} seguidores</span>
            </p>
            <AlbumStrip username={user.username} />
            {!isOwnCard && currentUsername && (
                <button
                    className={`user-card__follow-btn ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollow}
                    disabled={loadingFollow}
                >
                    {loadingFollow ? '...' : isFollowing ? 'Siguiendo' : '+ Seguir'}
                </button>
            )}
        </div>
    );
};

// ─── Carrusel ─────────────────────────────────────────────────────────────────
const UserCarousel = ({ title, users, userStats, currentUsername }) => {
    const ref = useRef(null);
    const scroll = dir => ref.current?.scrollBy({ left: dir * 800, behavior: 'smooth' });
    if (!users.length) return null;

    return (
        <section className="carousel-section">
            <div className="carousel-header">
                <h2 className="carousel-title">{title}</h2>
                <span className="carousel-count">{users.length} usuarios</span>
            </div>
            <div className="carousel-outer">
                <div className="carousel-wrapper" ref={ref}>
                    <div className="carousel-track">
                        {users.map(user => (
                            <UserCard
                                key={user.idUser}
                                user={user}
                                stats={userStats[user.username] || {}}
                                currentUsername={currentUsername}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─── Resultados de búsqueda ───────────────────────────────────────────────────
const SearchResults = ({ users, currentUsername }) => {
    const navigate = useNavigate();
    if (!users.length) return (
        <div className="search-empty"><p>No se encontraron usuarios</p></div>
    );

    return (
        <div className="search-results">
            {users.map(user => {
                const avatarUrl = user.avatarUrl
                    || `https://ui-avatars.com/api/?name=${user.username}&size=200&background=e85d26&color=fff`;
                return (
                    <div key={user.idUser} className="search-result-card" onClick={() => navigate(`/profile/${user.username}`)}>
                        <img className="search-result-card__avatar" src={avatarUrl} alt={user.username}
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${user.username}&size=200&background=e85d26&color=fff`; }} />
                        <div className="search-result-card__info">
                            <span className="search-result-card__username">{user.username}</span>
                            <span className="search-result-card__bio">{user.bio || 'Sin biografía'}</span>
                        </div>
                        <span className="search-result-card__arrow">→</span>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const ExploreUsers = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [topReviewers, setTopReviewers] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [userStats, setUserStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const searchDebounce = useRef(null);
    const navigate = useNavigate();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const fetchStats = async (users) => {
        const stats = {};
        await Promise.all(users.map(async (user) => {
            if (stats[user.username]) return;
            const [rRes, lRes, fRes] = await Promise.all([
                apiFetch(`/reviews/user/${user.username}`),
                apiFetch(`/soundlist/user/${user.username}`),
                apiFetch(`/follow/followers/${user.username}`)
            ]);
            const [reviews, lists, followers] = await Promise.all([rRes.json(), lRes.json(), fRes.json()]);
            stats[user.username] = { reviews: reviews.length, lists: lists.length, followers: followers.length };
        }));
        return stats;
    };

    useEffect(() => {
        const load = async () => {
            try {
                const [topRes, reviewersRes, ratedRes] = await Promise.all([
                    apiFetch('/follow/top-users'),
                    apiFetch('/user/top-reviewers'),
                    apiFetch('/user/top-rated')
                ]);
                const [topData, reviewersData, ratedData] = await Promise.all([
                    topRes.json(), reviewersRes.json(), ratedRes.json()
                ]);
                const me = currentUser?.username;
                const fTop = topData.filter(u => u.username !== me);
                const fRev = reviewersData.filter(u => u.username !== me);
                const fRat = ratedData.filter(u => u.username !== me);
                setTopUsers(fTop); setTopReviewers(fRev); setTopRated(fRat);
                const allUsers = [...new Map([...fTop, ...fRev, ...fRat].map(u => [u.username, u])).values()];
                setUserStats(await fetchStats(allUsers));
            } catch {
            } finally { setLoading(false); }
        };
        load();
    }, []);

    // Bug corregido: si el campo queda vacío, limpia estado inmediatamente sin esperar el debounce
    const handleSearchChange = (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        clearTimeout(searchDebounce.current);

        if (!q.trim()) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        searchDebounce.current = setTimeout(async () => {
            try {
                const res = await apiFetch(`/user/search?query=${encodeURIComponent(q.trim())}`);
                const data = await res.json();
                setSearchResults(data.filter(u => u.username !== currentUser?.username));
            } catch {
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 350);
    };

    const clearSearch = () => {
        clearTimeout(searchDebounce.current);
        setSearchQuery('');
        setSearchResults([]);
        setSearching(false);
    };

    const isSearchActive = searchQuery.trim().length > 0;

    if (loading) return (
        <div className="explore-loading">
            <div className="loading-spinner" />
            <p>Cargando...</p>
        </div>
    );

return (
  <div>

    {/* Navbar — sin padding propio */}
    <div className='userhome-header'>
      <h1 className='title' onClick={() => navigate('/user-home')}>CRATE</h1>
      <SearchBar />
    </div>

    {/* Contenido con padding */}
    <div className="explore-page">
      {isSearchActive ? (
        <div className="explore-search-section">
          <div className="carousel-header">
            <h2 className="carousel-title">
              {searching ? 'Buscando...' : `Resultados para "${searchQuery}"`}
            </h2>
            {!searching && <span className="carousel-count">{searchResults.length} encontrados</span>}
          </div>
          {searching
            ? <div className="explore-search-loading"><div className="loading-spinner" /></div>
            : <SearchResults users={searchResults} currentUsername={currentUser?.username} />
          }
        </div>
      ) : (
        <>
          <UserCarousel title="Usuarios destacados"  users={topUsers}     userStats={userStats} currentUsername={currentUser?.username} />
          <UserCarousel title="Usuarios más activos" users={topReviewers} userStats={userStats} currentUsername={currentUser?.username} />
          <UserCarousel title="Mejores valoraciones" users={topRated}     userStats={userStats} currentUsername={currentUser?.username} />
        </>
      )}
    </div>

    {/* Footer y menú fuera del padding */}
    <UserSlideMenu />
    <Footer />

  </div>
);
};

export default ExploreUsers;
