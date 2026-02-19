import { useState } from 'react';
import { apiFetch } from '../../api';

const StarRating = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(null);
    const display = hovered !== null ? hovered : value;

    const handleMouseMove = (e, star) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setHovered(x < rect.width / 2 ? star - 0.5 : star);
    };

    const handleClick = (e, star) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        onChange(x < rect.width / 2 ? star - 0.5 : star);
    };

    return (
        <div className="ap-star-selector">
            {[1, 2, 3, 4, 5].map(star => {
                const full = display >= star;
                const half = !full && display >= star - 0.5;
                return (
                    <div
                        key={star}
                        className="ap-star-wrap"
                        onMouseMove={e => handleMouseMove(e, star)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={e => handleClick(e, star)}
                    >
                        <span style={{ position: 'absolute', top: 0, left: 0, fontSize: '40px', color: '#444', userSelect: 'none' }}>★</span>
                        {(full || half) && (
                            <span style={{
                                position: 'absolute', top: 0, left: 0,
                                fontSize: '40px', color: '#ff5500',
                                width: full ? '100%' : '50%',
                                overflow: 'hidden', display: 'block',
                                whiteSpace: 'nowrap', userSelect: 'none'
                            }}>★</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export const RenderStars = ({ rating }) => {
    return (
        <div style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map(star => {
                const full = rating >= star;
                const half = !full && rating >= star - 0.5;
                return (
                    <div key={star} style={{ position: 'relative', width: '20px', height: '20px', flexShrink: 0 }}>
                        <span style={{ position: 'absolute', top: 0, left: 0, fontSize: '20px', color: '#444', userSelect: 'none' }}>★</span>
                        {(full || half) && (
                            <span style={{
                                position: 'absolute', top: 0, left: 0,
                                fontSize: '20px', color: '#ff5500',
                                width: full ? '100%' : '50%',
                                overflow: 'hidden', display: 'block',
                                whiteSpace: 'nowrap', userSelect: 'none'
                            }}>★</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const ReviewForm = ({ currentUser, spotifyAlbumId, existingReview, onSave, onCancel }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!rating) return alert('Selecciona una puntuación');
        setSaving(true);
        try {
            const res = await apiFetch('/reviews/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.idUser,
                    albumSpotifyId: spotifyAlbumId,
                    rating,
                    comment
                })
            });
            const result = await res.json();
            if (result > 0) onSave({ rating, comment });
        } catch (err) {
            console.error('Error guardando review:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ap-review-form">
            <h4>{existingReview ? 'Editar tu review' : 'Escribe tu review'}</h4>
            <StarRating value={rating} onChange={setRating} />
            <textarea
                className="ap-textarea"
                placeholder="¿Qué te pareció este álbum?"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
            />
            <div className="ap-form-buttons">
                <button className="ap-btn-save" onClick={handleSubmit} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar'}
                </button>
                {onCancel && (
                    <button className="ap-btn-cancel" onClick={onCancel}>Cancelar</button>
                )}
            </div>
        </div>
    );
};

const AlbumReviews = ({ spotifyAlbumId, currentUser, reviews, myReview, setMyReview, setReviews, setAverage }) => {
    const [editing, setEditing] = useState(false);

    const handleSave = async () => {
        const res = await apiFetch(`/reviews/user/${currentUser.username}/album/${spotifyAlbumId}`);
        const updated = await res.json();
        setMyReview(updated);
        setEditing(false);
        const avgRes = await apiFetch(`/reviews/average/${spotifyAlbumId}`);
        setAverage(await avgRes.json());
    };

    const handleDelete = async () => {
        if (!confirm('¿Seguro que quieres borrar tu review?')) return;
        await apiFetch(`/reviews/delete/${myReview.id}`, { method: 'DELETE' });
        setMyReview(null);
        setEditing(false);
        const avgRes = await apiFetch(`/reviews/average/${spotifyAlbumId}`);
        setAverage(await avgRes.json());
    };

    return (
        <div className="ap-reviews">
            <h3>Reviews</h3>

            {currentUser && (
                <>
                    {!myReview && !editing && (
                        <div className="ap-review-card ap-my-empty">
                            <span className="ap-username">{currentUser.username}</span>
                            <p className="ap-no-review-text">Aún no has valorado este álbum</p>
                            <button className="ap-btn-write" onClick={() => setEditing(true)}>
                                + Escribir review
                            </button>
                        </div>
                    )}

                    {!myReview && editing && (
                        <div className="ap-review-card ap-my-card">
                            <ReviewForm
                                currentUser={currentUser}
                                spotifyAlbumId={spotifyAlbumId}
                                existingReview={null}
                                onSave={handleSave}
                                onCancel={() => setEditing(false)}
                            />
                        </div>
                    )}

                    {myReview && !editing && (
                        <div className="ap-review-card ap-my-card">
                            <div className="ap-review-top">
                                <span className="ap-username">
                                    {currentUser.username} <span className="ap-you-badge">tú</span>
                                </span>
                                <RenderStars rating={myReview.rating} />
                            </div>
                            {myReview.comment && <p className="ap-comment">{myReview.comment}</p>}
                            <div className="ap-my-actions">
                                <button className="ap-btn-edit" onClick={() => setEditing(true)}>Editar</button>
                                <button className="ap-btn-delete" onClick={handleDelete}>Borrar</button>
                            </div>
                        </div>
                    )}

                    {myReview && editing && (
                        <div className="ap-review-card ap-my-card">
                            <ReviewForm
                                currentUser={currentUser}
                                spotifyAlbumId={spotifyAlbumId}
                                existingReview={myReview}
                                onSave={handleSave}
                                onCancel={() => setEditing(false)}
                            />
                        </div>
                    )}
                </>
            )}

            {reviews.length === 0 && !myReview ? (
                <p className="ap-no-reviews">Este álbum no tiene reviews aún.</p>
            ) : (
                reviews.map(review => (
                    <div key={review.id} className="ap-review-card">
                        <div className="ap-review-top">
                            <span className="ap-username">{review.user.username}</span>
                            <RenderStars rating={review.rating} />
                        </div>
                        {review.comment && <p className="ap-comment">{review.comment}</p>}
                        <span className="ap-date">
                            {new Date(review.createdAt).toLocaleDateString('es-ES')}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

export default AlbumReviews;
