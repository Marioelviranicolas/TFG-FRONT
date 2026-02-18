import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api'; 
import './FollowedReviews.css';
import { useNavigate } from 'react-router-dom';

const FollowedReviews = ({ userId }) => {
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
                                    <span className="username">{review.user.username}</span>
                                    <div className="rating">
                                    {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                                        <svg
                                        key={`full-${review.id}-${i}`}
                                        viewBox="0 0 100 100"
                                        width="18"
                                        height="18"
                                        >
                                        {/* Vinilo completo */}
                                        <circle cx="50" cy="50" r="48" fill="#111" />
                                        <circle cx="50" cy="50" r="15" fill="#e63946" />
                                        <circle cx="50" cy="50" r="4" fill="#fff" />
                                        </svg>
                                    ))}

                                    {review.rating % 1 !== 0 && (
                                        <svg
                                        key={`half-${review.id}`}
                                        viewBox="0 0 100 100"
                                        width="18"
                                        height="18"
                                        >
                                        <defs>
                                            <clipPath id={`half-clip-${review.id}`}>
                                            <rect x="0" y="0" width="50" height="100" />
                                            </clipPath>
                                        </defs>

                                        {/* Vinilo base (medio negro) */}
                                        <g clipPath={`url(#half-clip-${review.id})`}>
                                            <circle cx="50" cy="50" r="48" fill="#111" />
                                        </g>

                                        {/* Etiqueta central */}
                                        <circle cx="50" cy="50" r="15" fill="#e63946" />
                                        <circle cx="50" cy="50" r="4" fill="#fff" />
                                        </svg>
                                    )}
                                    </div>
                                </div>
    
                                <div className="hover-details">
                                    <h3>{review.album.title}</h3>
                                    <p>{review.album.artist}</p>
                                    {review.comment && (
                                        <p className="comment">{review.comment}</p>
                                    )}
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