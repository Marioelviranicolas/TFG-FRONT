// src/components/album/reviews/ReviewForm.jsx
import { useState } from 'react';
import { apiFetch } from '../../../api';
import StarRating from './StarRating';

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
            <p className="ap-review-form-title">
                {existingReview ? 'Editar review' : 'Escribir review'}
            </p>
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
                    {saving ? 'Guardando…' : 'Guardar'}
                </button>
                {onCancel && (
                    <button className="ap-btn-cancel" onClick={onCancel}>Cancelar</button>
                )}
            </div>
        </div>
    );
};

export default ReviewForm;