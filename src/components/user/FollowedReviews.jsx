import { useState, useEffect } from 'react';
import axios from 'axios';
import './FollowedReviews.css';

const FollowedReviews = ({ userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('🔵 FollowedReviews montado con userId:', userId);

    useEffect(() => {
        const fetchReviews = async () => {
            console.log('🟢 Iniciando fetch para userId:', userId);
            
            try {
                setLoading(true);
                const url = `http://localhost:9001/reviews/followed/${userId}/recent?limit=30`;
                console.log('🟡 URL:', url);
                
                const response = await axios.get(url);
                console.log('✅ Respuesta recibida:', response.data);
                console.log('📊 Número de reviews:', response.data.length);
                
                setReviews(response.data);
                setError(null);
            } catch (err) {
                console.error('❌ Error completo:', err);
                console.error('❌ Error response:', err.response);
                setError('No se pudieron cargar las reviews');
            } finally {
                console.log('🏁 Fetch finalizado, setting loading false');
                setLoading(false);
            }
        };

        if (userId) {
            console.log('✅ userId existe, haciendo fetch');
            fetchReviews();
        } else {
            console.log('❌ NO hay userId');
            setLoading(false);
        }
    }, [userId]);

    console.log('🔄 Estado actual:', { loading, error, reviewsCount: reviews.length });

    if (loading) {
        console.log('⏳ Mostrando loading...');
        return <div className="loading">Cargando reviews...</div>;
    }
    
    if (error) {
        console.log('⚠️ Mostrando error:', error);
        return <div className="error">{error}</div>;
    }
    
    if (!reviews.length) {
        console.log('📭 No hay reviews');
        return <div className="no-reviews">No hay reviews de las personas que sigues</div>;
    }

    console.log('🎉 Renderizando', reviews.length, 'reviews');

    return (
        <div className="followed-reviews">
            <h2>Nuevas escuchas de tus amigos.</h2>
            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="user-info">
                                <img 
                                    src={review.user.avatarUrl || '/default-avatar.png'} 
                                    alt={review.user.username}
                                />
                                <span className="username">{review.user.username}</span>
                            </div>
                            <div className="rating">
                                {'⭐'.repeat(Math.floor(review.rating))} {review.rating}
                            </div>
                        </div>

                        <div className="album-info">
                            <img 
                                src={review.album.coverUrl} 
                                alt={review.album.title}
                            />
                            <div>
                                <h3>{review.album.title}</h3>
                                <p>{review.album.artist}</p>
                            </div>
                        </div>

                        {review.comment && (
                            <p className="comment">{review.comment}</p>
                        )}

                        <div className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowedReviews;