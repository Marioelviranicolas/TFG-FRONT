import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './FollowedReviews.css';

const FollowedReviews = ({ userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null); 

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
                const url = `http://localhost:9001/reviews/followed/${userId}/recent?limit=30`;
                console.log('URL:', url);
                
                const response = await axios.get(url);
                console.log('Respuesta recibida:', response.data);
                console.log('Número de reviews:', response.data.length);
                
                setReviews(response.data);
                setError(null);
            } catch (err) {
                console.error('Error completo:', err);
                console.error('Error response:', err.response);
                setError('No se pudieron cargar las reviews');
            } finally {
                console.log('Fetch finalizado, setting loading false');
                setLoading(false);
            }
        };

        if (userId) {
            console.log('userId existe, haciendo fetch');
            fetchReviews();
        } else {
            console.log('NO hay userId');
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
            <h2>Nuevas escuchas de tus amigos.</h2>
            <a href='##'>All Activity</a>
            </div>
            
                <div className="reviews-list-carousel" ref={carouselRef}>
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <img 
                                src={review.album.coverUrl} 
                                alt={review.album.title}
                                className="album-cover"
                            />
                            
                            <div className="review-info">
                                <div className="review-header">
                                    <span className="username">{review.user.username}</span>
                                    <div className="rating">
                                        {'⭐'.repeat(Math.floor(review.rating))}
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