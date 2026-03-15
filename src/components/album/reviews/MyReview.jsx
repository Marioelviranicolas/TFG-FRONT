// src/components/album/reviews/MyReview.jsx
import { useState } from 'react';
import { apiFetch } from '../../../api';
import RenderStars from './RenderStars';
import ReviewForm from './ReviewForm';

const MyReview = ({ currentUser, spotifyAlbumId, myReview, setMyReview, setAverage }) => {
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

    // Sin review todavía
    if (!myReview && !editing) return (
        <div className="ap-review-card ap-review-card--empty">
            <span className="ap-username">{currentUser.username}</span>
            <p className="ap-no-review-text">Aún no has valorado este álbum</p>
            <button className="ap-btn-write" onClick={() => setEditing(true)}>
                + Escribir review
            </button>
        </div>
    );

    // Formulario nuevo
    if (!myReview && editing) return (
        <div className="ap-review-card ap-review-card--mine">
            <ReviewForm
                currentUser={currentUser}
                spotifyAlbumId={spotifyAlbumId}
                existingReview={null}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
            />
        </div>
    );

    // Formulario edición
    if (myReview && editing) return (
        <div className="ap-review-card ap-review-card--mine">
            <ReviewForm
                currentUser={currentUser}
                spotifyAlbumId={spotifyAlbumId}
                existingReview={myReview}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
            />
        </div>
    );

    // Review existente
    return (
        <div className="ap-review-card ap-review-card--mine">
            <div className="ap-review-top">
                <span className="ap-username">
                    {currentUser.username}
                    <span className="ap-you-badge">tú</span>
                </span>
                <RenderStars rating={myReview.rating} />
            </div>
            {myReview.comment && <p className="ap-comment">{myReview.comment}</p>}
            <div className="ap-review-actions">
                <button className="ap-btn-edit" onClick={() => setEditing(true)}>Editar</button>
                <button className="ap-btn-delete" onClick={handleDelete}>Borrar</button>
            </div>
        </div>
    );
};

export default MyReview;
