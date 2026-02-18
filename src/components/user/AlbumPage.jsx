import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './AlbumPage.css';

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
                        <span style={{
                            position: 'absolute', top: 0, left: 0,
                            fontSize: '40px', color: '#444', userSelect: 'none'
                        }}>★</span>
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

const RenderStars = ({ rating }) => {
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
            if (result > 0) {
                onSave({ rating, comment });
            }
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

const AddToListModal = ({ spotifyAlbumId, currentUser, onClose }) => {
    const [lists, setLists] = useState([]);
    const [loadingLists, setLoadingLists] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [savingNew, setSavingNew] = useState(false);

    useEffect(() => {
        apiFetch(`/soundlist/user/${currentUser.username}`)
            .then(r => r.json())
            .then(setLists)
            .catch(console.error)
            .finally(() => setLoadingLists(false));
    }, [currentUser.username]);

    const showFeedback = (type, text) => {
        setFeedback({ type, text });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleAddToList = async (listId) => {
        const res = await apiFetch('/listalbum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identificadorLista: listId, albumSpotifyId: spotifyAlbumId })
        });
        const result = await res.json();
        if (result === 1) showFeedback('success', '¡Álbum añadido a la lista!');
        else if (result === -1) showFeedback('error', 'Este álbum ya está en esa lista.');
        else if (result === -2) showFeedback('error', 'No puedes modificar una lista que no es tuya.');
        else showFeedback('error', 'No se pudo añadir el álbum.');
    };

    const handleCreateAndAdd = async () => {
        if (!newName.trim()) return showFeedback('error', 'El nombre no puede estar vacío.');
        setSavingNew(true);
        try {
            const createRes = await apiFetch('/soundlist/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { idUser: currentUser.idUser },
                    name: newName.trim(),
                    description: newDescription.trim()
                })
            });
            const createResult = await createRes.json();
            if (createResult <= 0) return showFeedback('error', 'No se pudo crear la lista.');

            const updatedLists = await apiFetch(`/soundlist/user/${currentUser.username}`).then(r => r.json());
            setLists(updatedLists);
            const newList = updatedLists.find(l => l.name === newName.trim());
            if (newList) await handleAddToList(newList.id);
            setCreatingNew(false);
            setNewName('');
            setNewDescription('');
        } catch (err) {
            showFeedback('error', 'Error de conexión.');
        } finally {
            setSavingNew(false);
        }
    };

    return (
        <div className="ap-modal-overlay" onClick={onClose}>
            <div className="ap-modal" onClick={e => e.stopPropagation()}>
                <div className="ap-modal-header">
                    <h3>Añadir a lista</h3>
                    <button className="ap-modal-close" onClick={onClose}>✕</button>
                </div>

                {feedback && (
                    <div className={`ap-modal-feedback ap-modal-feedback--${feedback.type}`}>
                        {feedback.text}
                    </div>
                )}

                {loadingLists ? (
                    <p className="ap-modal-loading">Cargando tus listas...</p>
                ) : (
                    <>
                        {lists.length === 0 && !creatingNew && (
                            <p className="ap-modal-empty">No tienes listas aún. ¡Crea una!</p>
                        )}
                        <div className="ap-modal-lists">
                            {lists.map(list => (
                                <button
                                    key={list.id}
                                    className="ap-modal-list-item"
                                    onClick={() => handleAddToList(list.id)}
                                >
                                    <span className="ap-modal-list-name">{list.name}</span>
                                    {list.description && (
                                        <span className="ap-modal-list-desc">{list.description}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {!creatingNew ? (
                            <button className="ap-btn-new-list" onClick={() => setCreatingNew(true)}>
                                + Crear nueva lista
                            </button>
                        ) : (
                            <div className="ap-new-list-form">
                                <h4>Nueva lista</h4>
                                <input
                                    className="ap-input"
                                    type="text"
                                    placeholder="Nombre *"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    maxLength={100}
                                />
                                <textarea
                                    className="ap-textarea"
                                    placeholder="Descripción (opcional)"
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                    rows={2}
                                />
                                <div className="ap-form-buttons">
                                    <button className="ap-btn-save" onClick={handleCreateAndAdd} disabled={savingNew}>
                                        {savingNew ? 'Creando...' : 'Crear y añadir'}
                                    </button>
                                    <button className="ap-btn-cancel" onClick={() => {
                                        setCreatingNew(false);
                                        setNewName('');
                                        setNewDescription('');
                                    }}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const AlbumPage = () => {
    const { spotifyAlbumId } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myReview, setMyReview] = useState(null);
    const [editing, setEditing] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

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
                setAverage(avgData);

                if (currentUser) {
                    const myReviewData = reviewsData.find(
                        r => r.user.username === currentUser.username
                    );
                    setMyReview(myReviewData || null);
                    setReviews(reviewsData.filter(
                        r => r.user.username !== currentUser.username
                    ));
                } else {
                    setReviews(reviewsData);
                }
            } catch (err) {
                console.error('Error cargando álbum:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [spotifyAlbumId]);

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

    if (loading) return <div className="ap-loading">Cargando...</div>;
    if (!album) return <div className="ap-loading">Álbum no encontrado</div>;

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
                            <span className="ap-average-label"> / 5 · {reviews.length + (myReview ? 1 : 0)} reviews</span>
                        </div>
                    )}
                    {currentUser && (
                        <button className="ap-btn-add-list" onClick={() => setShowListModal(true)}>
                            + Añadir a lista
                        </button>
                    )}
                </div>
            </div>

            {showListModal && (
                <AddToListModal
                    spotifyAlbumId={spotifyAlbumId}
                    currentUser={currentUser}
                    onClose={() => setShowListModal(false)}
                />
            )}

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
        </div>
    );
};

export default AlbumPage;
