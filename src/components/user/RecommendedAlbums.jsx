import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api';
import { useNavigate } from 'react-router-dom';
import './RecommendedAlbums.css';

const RecommendedAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                setLoading(true);
                const response = await apiFetch('/albums/todos');
                const data = await response.json();

                // Mezcla aleatoria (Fisher-Yates shuffle)
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setAlbums(shuffled.slice(0, 30)); // máximo 30
                setError(null);
            } catch (err) {
                console.error('Error cargando álbumes:', err);
                setError('No se pudieron cargar las recomendaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    if (loading) return <div className="loading">Cargando recomendaciones...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!albums.length) return null;

    return (
        
        <div className="recommended-albums">
            <div className="reviews-carousel">
                <div className="reviews-title">
                    <h2>Recomendaciones de esta semana</h2>
                </div>
                <div className="reviews-list-carousel" ref={carouselRef}>
                    {albums.map(album => (
                        <div
                            key={album.spotifyAlbumId}
                            className="review-card album-only-card"
                            onClick={() => navigate(`/album/${album.spotifyAlbumId}`)}
                        >
                            <img
                                src={album.coverUrl}
                                alt={album.title}
                                className="album-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendedAlbums;