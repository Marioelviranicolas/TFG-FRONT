import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api'; 
import './FollowedReviews.css';
import { useNavigate } from 'react-router-dom';

const FollowedReviews = ({ userId }) => {

     const getAvatarUrl = (user) => {
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${user?.username}&size=200&background=FF6B35&color=fff`;
  };
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null); 
    const navigate = useNavigate();

    console.log('FollowedReviews montado con userId:', userId);

    const scroll = (direction) => {
        const container = carouselRef.current;
        const scrollAmount = 320; // ancho de la tarjeta + gap
        
        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };


    useEffect(() => {
        const fetchReviews = async () => {
            console.log('Iniciando fetch para userId:', userId);
            
            try {
                setLoading(true);
                
                const response = await apiFetch(`/reviews/followed/${userId}/recent?limit=30`);
                const data = await response.json();
                
                console.log('Respuesta recibida:', data[0]);
                
                setReviews(data);
                setError(null);
            } catch (err) {
                console.error('Error completo:', err);
                setError('No se pudieron cargar las reviews');
            } finally {
                setLoading(false);
            }
        };
    
        if (userId) {
            fetchReviews();
        } else {
            setLoading(false);
        }
    }, [userId]);

    console.log('Estado actual:', { loading, error, reviewsCount: reviews.length });
    

    if (loading) {
        console.log('Mostrando loading...');
        return <div className="loading">Cargando reviews...</div>;
    }
    
    if (error) {
        console.log('Mostrando error:', error);
        return <div className="error">{error}</div>;
    }
    
    if (!reviews.length) {
        console.log('No hay reviews');
        return <div className="no-reviews">No hay reviews de las personas que sigues</div>;
    }

    console.log('Renderizando', reviews.length, 'reviews');

    return (
        <div className="followed-reviews">
            <div className="reviews-carousel">
            <div className="reviews-title">
            <h2>Nuevas escuchas de tus amigos</h2>
            <a href='##'>All Activity</a>
            </div>
            
                <div className="reviews-list-carousel" ref={carouselRef}>
                    {reviews.map(review => (
                        <div 
                            key={review.id} 
                            className="review-card"
                            onClick={() => navigate(`/album/${review.album.spotifyAlbumId}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img 
                                src={review.album.coverUrl} 
                                alt={review.album.title}
                                className="album-cover"
                            />
                            
                            <div className="review-info">
                                <div className="review-header">
                                    <img 
                                    src={getAvatarUrl(review.user)} 
                                    alt={review.user.username}
                                    className="avatar"
                                    />
                                    <div className='rating-username'>
                                    <span 
                                        className="username"
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // 🔥 evita que salte el click del padre
                                            navigate(`/profile/${review.user.username}`);
                                        }}
                                        >
                                        {review.user.username}
                                    </span>
                                    
                                    <div className="rating">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const full = i < Math.floor(review.rating);
                                        const half = i === Math.floor(review.rating) && review.rating % 1 !== 0;

                                        return (
                                        <svg
                                            key={i}
                                            viewBox="0 0 24 24"
                                            width="18"
                                            height="18"
                                        >
                                            {/* estrella base (vacía) */}
                                            <path
                                            d="M12 17.27L18.18 21 16.54 13.97 
                                                22 9.24 14.81 8.63 
                                                12 2 9.19 8.63 
                                                2 9.24 7.46 13.97 
                                                5.82 21z"
                                            fill="#ddd"
                                            />

                                            {/* estrella llena */}
                                            {full && (
                                            <path
                                                d="M12 17.27L18.18 21 16.54 13.97 
                                                22 9.24 14.81 8.63 
                                                12 2 9.19 8.63 
                                                2 9.24 7.46 13.97 
                                                5.82 21z"
                                                fill="#f5c518"
                                            />
                                            )}

                                            {/* media estrella */}
                                            {half && (
                                            <>
                                                <defs>
                                                <clipPath id={`half-star-${review.id}-${i}`}>
                                                    <rect x="0" y="0" width="12" height="24" />
                                                </clipPath>
                                                </defs>

                                                <path
                                                d="M12 17.27L18.18 21 16.54 13.97 
                                                    22 9.24 14.81 8.63 
                                                    12 2 9.19 8.63 
                                                    2 9.24 7.46 13.97 
                                                    5.82 21z"
                                                fill="#f5c518"
                                                clipPath={`url(#half-star-${review.id}-${i})`}
                                                />
                                            </>
                                            )}
                                        </svg>
                                        );
                                    })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default FollowedReviews;