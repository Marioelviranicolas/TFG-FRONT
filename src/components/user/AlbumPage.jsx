import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './AlbumPage.css';
import AlbumReviews from './AlbumReviews';
import AlbumLists from './AlbumLists';

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
    const [showListModal, setShowListModal] = useState(false);
    const [activeTab, setActiveTab] = useState('reviews');
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
                    const myReviewData = reviewsData.find(r => r.user.username === currentUser.username);
                    setMyReview(myReviewData || null);
                    setReviews(reviewsData.filter(r => r.user.username !== currentUser.username));
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

            {/* TABS */}
            <div className="ap-tabs">
                <button
                    className={`ap-tab ${activeTab === 'reviews' ? 'ap-tab--active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
                <button
                    className={`ap-tab ${activeTab === 'lists' ? 'ap-tab--active' : ''}`}
                    onClick={() => setActiveTab('lists')}
                >
                    Listas
                </button>
            </div>

            {activeTab === 'reviews' && (
                <AlbumReviews
                    spotifyAlbumId={spotifyAlbumId}
                    currentUser={currentUser}
                    reviews={reviews}
                    myReview={myReview}
                    setMyReview={setMyReview}
                    setReviews={setReviews}
                    setAverage={setAverage}
                />
            )}

            {activeTab === 'lists' && (
                <AlbumLists spotifyAlbumId={spotifyAlbumId} />
            )}
        </div>
    );
};

export default AlbumPage;
