// src/perfil/content/ProfileReviews.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api';

export default function ProfileReviews({ username }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadReviews();
  }, [username]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/reviews/user/${username}`);
      const data = await res.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return (
      <span className="pp-review-rating">
        {'★'.repeat(full)}
        {half && '½'}
        {'☆'.repeat(5 - Math.ceil(rating))}
      </span>
    );
  };

  const parseDate = (date) => {
    if (!date) return '';
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      return new Date(year, month - 1, day).toLocaleDateString('es-ES');
    }
    return new Date(date).toLocaleDateString('es-ES');
  };

  if (loading) return <p className="pp-loading">Cargando reviews…</p>;

  return (
    <div>
      <span className="pp-section-title"></span>

      {reviews.length === 0 ? (
        <p className="pp-no-content">No hay reviews todavía.</p>
      ) : (
        reviews.map((review, index) => (
          <div
            key={review.id || index}
            className="pp-review-card"
            onClick={() => navigate(`/album/${review.album.spotifyAlbumId}`)}
          >
            {review.album?.coverUrl ? (
              <img
                src={review.album.coverUrl}
                alt={review.album.title}
                className="pp-review-cover"
              />
            ) : (
              <div className="pp-review-cover-placeholder">♪</div>
            )}

            <div className="pp-review-body">
              <span className="pp-review-album-title">
                {review.album?.title}
              </span>
              <span className="pp-review-artist">
                {review.album?.artist}
              </span>
              {renderStars(review.rating)}
              {review.comment && (
                <p className="pp-review-comment">{review.comment}</p>
              )}
              <span className="pp-review-date">{parseDate(review.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}