// src/components/album/reviews/LikeButton.jsx
import { useState, useEffect } from 'react';

const LikeButton = ({ reviewId }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const userId = currentUser?.idUser;

    useEffect(() => {
        // Carga el contador
        fetch(`http://localhost:9001/likes/count/${reviewId}`)
            .then(res => res.json())
            .then(count => setLikeCount(count))
            .catch(console.error);

        // Comprueba si el usuario ya dio like
        if (userId) {
            fetch(`http://localhost:9001/likes/check?userId=${userId}&reviewId=${reviewId}`)
                .then(res => res.json())
                .then(isLiked => setLiked(isLiked))
                .catch(console.error);
        }
    }, [reviewId, userId]);

    const handleToggle = async () => {
        if (loading || !userId) return;
        setLoading(true);

        // Optimistic update
        setLiked(prev => !prev);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);

        try {
            const res = await fetch(
                `http://localhost:9001/likes/toggle?userId=${userId}&reviewId=${reviewId}`,
                { method: 'POST' }
            );
            const result = await res.json(); // devuelve 1 (liked) o 0 (unliked) o -2 (error)

            if (result === -2) {
                // Revertir si hubo error
                setLiked(prev => !prev);
                setLikeCount(prev => liked ? prev + 1 : prev - 1);
            } else {
                setLiked(result === 1);
                // Recargamos el count real del back para estar sincronizados
                fetch(`http://localhost:9001/likes/count/${reviewId}`)
                    .then(res => res.json())
                    .then(count => setLikeCount(count));
            }
        } catch {
            setLiked(prev => !prev);
            setLikeCount(prev => liked ? prev + 1 : prev - 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleToggle}
            disabled={loading || !userId}
            title={!userId ? 'Inicia sesión para dar like' : ''}
        >
            <span className="like-heart">{liked ? '❤️' : '🤍'}</span>
            <span className="like-count">{likeCount}</span>
        </button>
    );
};

export default LikeButton;