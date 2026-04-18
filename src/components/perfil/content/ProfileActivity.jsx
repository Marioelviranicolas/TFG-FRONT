import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api';
import './ProfileActivity.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseDate = (date) => {
    if (!date) return new Date(0);
    if (Array.isArray(date)) {
        const [y, m, d, h = 0, min = 0, s = 0] = date;
        return new Date(y, m - 1, d, h, min, s);
    }
    return new Date(date);
};

const formatRelative = (date) => {
    const d = parseDate(date);
    const diff = Math.floor((Date.now() - d) / 1000);
    if (diff < 60)         return 'Ahora mismo';
    if (diff < 3600)       return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400)      return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 86400 * 7)  return `Hace ${Math.floor(diff / 86400)} días`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
};

const getAvatar = (username, avatarUrl) =>
    avatarUrl || `https://ui-avatars.com/api/?name=${username}&size=200&background=ff5500&color=fff`;

// ─── Eventos ──────────────────────────────────────────────────────────────────
const ReviewEvent = ({ item, navigate }) => (
    <div className="act-event" onClick={() => navigate(`/album/${item.album?.spotifyAlbumId}`)}>
        <div className="act-icon act-icon--review">★</div>
        <div className="act-body">
            <div className="act-meta">
                <span className="act-action">Reseñó un álbum</span>
                <span className="act-time">{formatRelative(item.createdAt)}</span>
            </div>
            <div className="act-card act-card--review">
                {item.album?.coverUrl && (
                    <img src={item.album.coverUrl} alt={item.album.title} className="act-cover" />
                )}
                <div className="act-card-info">
                    <p className="act-album-title">{item.album?.title}</p>
                    <p className="act-album-artist">{item.album?.artist}</p>
                    <p className="act-stars">{renderStars(item.rating)}</p>
                    {item.comment && <p className="act-comment">"{item.comment}"</p>}
                </div>
            </div>
        </div>
    </div>
);

const ListEvent = ({ item, navigate }) => (
    <div className="act-event" onClick={() => navigate(`/list/${item.id}`)}>
        <div className="act-icon act-icon--list">≡</div>
        <div className="act-body">
            <div className="act-meta">
                <span className="act-action">Creó una lista</span>
                <span className="act-time">{formatRelative(item.createdAt)}</span>
            </div>
            <div className="act-card act-card--list">
                <p className="act-list-name">{item.name}</p>
                {item.description && <p className="act-list-desc">{item.description}</p>}
                {item.albumCount > 0 && (
                    <p className="act-list-count">{item.albumCount} álbum{item.albumCount !== 1 ? 'es' : ''}</p>
                )}
            </div>
        </div>
    </div>
);

// Seguir a alguien (el usuario del perfil siguió a X)
const FollowingEvent = ({ item, navigate, username }) => {
    const otherUser = item.followerUsername === username
        ? { name: item.followedUsername, avatar: item.followedAvatarUrl }
        : { name: item.followerUsername, avatar: item.followerAvatarUrl };

    return (
        <div className="act-event" onClick={() => navigate(`/profile/${otherUser.name}`)}>
            <div className="act-icon act-icon--follow-out">+</div>
            <div className="act-body">
                <div className="act-meta">
                    <span className="act-action">Empezó a seguir a alguien</span>
                    <span className="act-time">{formatRelative(item.createdAt)}</span>
                </div>
                <div className="act-card act-card--follow">
                    <img
                        className="act-follow-avatar"
                        src={getAvatar(otherUser.name, otherUser.avatar)}
                        alt={otherUser.name}
                    />
                    <div className="act-follow-info">
                        <p className="act-follow-username">{otherUser.name}</p>
                        <p className="act-follow-sub">Ver perfil →</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Fue seguido por alguien (X siguió al usuario del perfil)
const FollowerEvent = ({ item, navigate, username }) => {
    const follower = { name: item.followerUsername, avatar: item.followerAvatarUrl };

    return (
        <div className="act-event" onClick={() => navigate(`/profile/${follower.name}`)}>
            <div className="act-icon act-icon--follow-in">♥</div>
            <div className="act-body">
                <div className="act-meta">
                    <span className="act-action">Nuevo seguidor</span>
                    <span className="act-time">{formatRelative(item.createdAt)}</span>
                </div>
                <div className="act-card act-card--follow">
                    <img
                        className="act-follow-avatar"
                        src={getAvatar(follower.name, follower.avatar)}
                        alt={follower.name}
                    />
                    <div className="act-follow-info">
                        <p className="act-follow-username">{follower.name}</p>
                        <p className="act-follow-sub">empezó a seguirte</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ProfileActivity({ username }) {
    const [events, setEvents]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter]   = useState('all');
    const navigate              = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [reviewsRes, listsRes, followingRes, followersRes] = await Promise.all([
                    apiFetch(`/reviews/user/${username}`),
                    apiFetch(`/soundlist/user/${username}`),
                    apiFetch(`/follow/following/${username}`),
                    apiFetch(`/follow/followers/${username}`)
                ]);
                const [reviewsData, listsData, followingData, followersData] = await Promise.all([
                    reviewsRes.json(),
                    listsRes.json(),
                    followingRes.json(),
                    followersRes.json()
                ]);

                const reviewEvents = (reviewsData || []).map(r => ({
                    ...r, _type: 'review', _sortDate: parseDate(r.createdAt)
                }));

                const listEvents = (listsData || []).map(l => ({
                    ...l, _type: 'list', _sortDate: parseDate(l.createdAt)
                }));

                // Follows que hizo el usuario (siguió a alguien)
                const followingEvents = (followingData || [])
                    .filter(f => f.createdAt) // solo los que tienen fecha
                    .map(f => ({
                        ...f, _type: 'following', _sortDate: parseDate(f.createdAt)
                    }));

                // Followers que recibió el usuario (alguien le siguió)
                const followerEvents = (followersData || [])
                    .filter(f => f.createdAt)
                    .map(f => ({
                        ...f, _type: 'follower', _sortDate: parseDate(f.createdAt)
                    }));

                const combined = [...reviewEvents, ...listEvents, ...followingEvents, ...followerEvents]
                    .sort((a, b) => b._sortDate - a._sortDate);

                setEvents(combined);
            } catch {
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [username]);

    const counts = {
        all:       events.length,
        reviews:   events.filter(e => e._type === 'review').length,
        lists:     events.filter(e => e._type === 'list').length,
        following: events.filter(e => e._type === 'following').length,
        followers: events.filter(e => e._type === 'follower').length,
    };

    const filtered = events.filter(e => {
        if (filter === 'reviews')   return e._type === 'review';
        if (filter === 'lists')     return e._type === 'list';
        if (filter === 'following') return e._type === 'following';
        if (filter === 'followers') return e._type === 'follower';
        return true;
    });

    if (loading) return <p className="pp-loading">Cargando actividad…</p>;

    return (
        <div className="act-root">

            {/* Filtros */}
            <div className="act-filters">
                {[
                    { key: 'all',       label: 'Todo'      },
                    { key: 'reviews',   label: 'Reviews'   },
                    { key: 'lists',     label: 'Listas'    },
                    { key: 'following', label: 'Siguiendo' },
                    { key: 'followers', label: 'Seguidores'},
                ].map(f => (
                    <button
                        key={f.key}
                        className={`act-filter-btn ${filter === f.key ? 'act-filter-btn--active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                        <span className="act-filter-count">{counts[f.key]}</span>
                    </button>
                ))}
            </div>

            {/* Feed */}
            {filtered.length === 0 ? (
                <p className="pp-no-content">Sin actividad reciente.</p>
            ) : (
                <div className="act-feed">
                    {filtered.map((item, i) => {
                        if (item._type === 'review')
                            return <ReviewEvent    key={`r-${item.id ?? i}`}  item={item} navigate={navigate} />;
                        if (item._type === 'list')
                            return <ListEvent      key={`l-${item.id ?? i}`}  item={item} navigate={navigate} />;
                        if (item._type === 'following')
                            return <FollowingEvent key={`fo-${i}`} item={item} navigate={navigate} username={username} />;
                        if (item._type === 'follower')
                            return <FollowerEvent  key={`fr-${i}`} item={item} navigate={navigate} username={username} />;
                        return null;
                    })}
                </div>
            )}
        </div>
    );
}
