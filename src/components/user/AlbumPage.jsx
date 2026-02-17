import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './AlbumPage.css';

const AlbumPage = () => {
    const { spotifyAlbumId } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [albumRes, reviewsRes, avgRes] = await Promise.all([
                    apiFetch(`/albums/id/${spotifyAlbumId}`),
                    apiFetch(`/reviews/album/${spotifyAlbumId}`),
                    apiFetch(`/reviews/average/${spotifyAlbumId}`)
                ]);

                const [albumData, reviewsData, avgData] = await Promise.all([
                    albumRes.json(),
                    reviewsRes.json(),
                    avgRes.json()
                ]);

                setAlbum(albumData);
                setReviews(reviewsData);
                setAverage(avgData);
            } catch (err) {
                console.error('Error cargando álbum:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [spotifyAlbumId]);

    if (loading) return <div className="loading">Cargando...</div>;
    if (!album) return <div className="error">Álbum no encontrado</div>;

    return (
        <div className="ap-page">
            <button className="ap-back-btn" onClick={() => navigate(-1)}>← Volver</button>
    
            <div className="ap-header">
                <img src={album.coverUrl} alt={album.title} className="ap-cover" />
                <div className="ap-info">
                    <h1>{album.title}</h1>
                    <h2>{album.artist}</h2>
                    {average !== null && (
                        <div className="ap-average">
                            <span className="ap-average-number">{Number(average).toFixed(1)}</span>
                            <span className="ap-average-label"> / 5 · {reviews.length} reviews</span>
                        </div>
                    )}
                </div>
            </div>
    
            <div className="ap-reviews">
                <h3>Reviews</h3>
                {reviews.length === 0 ? (
                    <p className="ap-no-reviews">Este álbum no tiene reviews aún.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="ap-review-card">
                            <div className="ap-review-top">
                                <span className="ap-username">{review.user.username}</span>
                                <span className="ap-rating">{'★'.repeat(Math.floor(review.rating))}{review.rating % 1 !== 0 ? '½' : ''}</span>
                            </div>
                            {review.comment && (
                                <p className="ap-comment">{review.comment}</p>
                            )}
                            <span className="ap-date">
                                {new Date(review.createdAt).toLocaleDateString('es-ES')}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlbumPage;