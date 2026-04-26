import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './FeaturedReviews.css';

const FeaturedReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    const getAvatarUrl = (user) => {
        if (user?.avatarUrl) return user.avatarUrl;
        return `https://ui-avatars.com/api/?name=${user?.username}&size=200&background=FF6B35&color=fff`;
    };

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Cargamos todas las reviews y las ordenamos por likes
                const res  = await apiFetch('/reviews/todos');
                const data = await res.json();

                // Ordenar por número de likes descendente y coger las 20 primeras
                const sorted = (data || [])
                    .filter(r => r.comment && r.comment.trim())
                    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
                    .slice(0, 3);

                setReviews(sorted);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) return <div className="loading">Cargando comentarios destacados...</div>;
    if (!reviews.length) return null;

    return (
        <div className="featured-reviews">
            <div className="reviews-title">
                <h2>Comentarios destacados</h2>
                <span className="featured-subtitle">Los más valorados por la comunidad</span>
            </div>

            <div className="featured-list" ref={carouselRef}>
                {reviews.map(review => (
                    <div
                        key={review.id}
                        className="featured-card"
                        onClick={() => navigate(`/album/${review.album?.spotifyAlbumId}`)}
                    >
                        {/* Portada */}
                        <img
                            src={review.album?.coverUrl}
                            alt={review.album?.title}
                            className="featured-cover"
                        />

                        {/* Contenido */}
                        <div className="featured-body">
                            <div className="featured-header">
                                <img
                                    src={getAvatarUrl(review.user)}
                                    alt={review.user?.username}
                                    className="featured-avatar"
                                    onClick={e => { e.stopPropagation(); navigate(`/profile/${review.user?.username}`); }}
                                />
                                <div className="featured-user-info">
                                    <span
                                        className="featured-username"
                                        onClick={e => { e.stopPropagation(); navigate(`/profile/${review.user?.username}`); }}
                                    >
                                        {review.user?.username}
                                    </span>
                                    <span className="featured-album-name">{review.album?.title}</span>
                                </div>
                                {/* Estrellas */}
                                <div className="featured-stars">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const full = i < Math.floor(review.rating);
                                        const half = i === Math.floor(review.rating) && review.rating % 1 !== 0;
                                        return (
                                            <svg key={i} viewBox="0 0 24 24" width="14" height="14">
                                                <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" fill="#333" />
                                                {full && <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" fill="#f5c518" />}
                                                {half && (
                                                    <>
                                                        <defs><clipPath id={`fr-half-${review.id}-${i}`}><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
                                                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" fill="#f5c518" clipPath={`url(#fr-half-${review.id}-${i})`} />
                                                    </>
                                                )}
                                            </svg>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Comentario */}
                            <p className="featured-comment">"{review.comment}"</p>

                            {/* Likes */}
                            {review.likesCount > 0 && (
                                <span className="featured-likes">♥ {review.likesCount}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedReviews;
