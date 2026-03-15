// src/components/album/modal/AddToListModal.jsx
import { useState, useEffect } from 'react';
import { apiFetch } from '../../../api';

const AddToListModal = ({ spotifyAlbumId, currentUser, onClose, onSuccess }) => {
    const [lists, setLists] = useState([]);
    const [loadingLists, setLoadingLists] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [savingNew, setSavingNew] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedList, setSelectedList] = useState(null);

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

    const handleAddToList = async (listId, albumId = spotifyAlbumId) => {
        try {
            const res = await apiFetch('/listalbum/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ albumSpotifyId: albumId, listId })
            });
            if (res.ok) {
                showFeedback('success', '¡Álbum añadido a la lista!');
                if (onSuccess) onSuccess();
                setSearchMode(false);
                setSearchQuery('');
                setSearchResults([]);
                setSelectedList(null);
            } else {
                showFeedback('error', 'Este álbum ya está en esa lista.');
            }
        } catch {
            showFeedback('error', 'Error al añadir el álbum.');
        }
    };

    const handleCreateAndAdd = async () => {
        if (!newName.trim()) return showFeedback('error', 'El nombre no puede estar vacío.');
        setSavingNew(true);
        try {
            const result = await apiFetch('/soundlist/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { idUser: currentUser.idUser },
                    name: newName.trim(),
                    description: newDescription.trim() || null
                })
            }).then(r => r.json());

            if (result !== 1) return showFeedback('error', 'No se pudo crear la lista.');

            const updatedLists = await apiFetch(`/soundlist/user/${currentUser.username}`).then(r => r.json());
            setLists(updatedLists);
            const newList = updatedLists[updatedLists.length - 1];

            if (newList && spotifyAlbumId) await handleAddToList(newList.id);
            showFeedback('success', '¡Lista creada!');
            setCreatingNew(false);
            setNewName('');
            setNewDescription('');
            if (!spotifyAlbumId) { setSelectedList(newList.id); setSearchMode(true); }
        } catch {
            showFeedback('error', 'Error de conexión.');
        } finally {
            setSavingNew(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) return setSearchResults([]);
        setSearching(true);
        try {
            const data = await apiFetch(`/albums/search?query=${encodeURIComponent(query)}`).then(r => r.json());
            setSearchResults(data || []);
        } catch {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectAlbum = async (album) => {
        if (!selectedList) return;
        await handleAddToList(selectedList, album.spotifyAlbumId);
        setSearchMode(false);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedList(null);
    };

    const modalTitle = searchMode ? 'Buscar álbum' : spotifyAlbumId ? 'Añadir a lista' : 'Crear lista';

    return (
        <div className="ap-modal-overlay" onClick={onClose}>
            <div className="ap-modal" onClick={e => e.stopPropagation()}>
                <div className="ap-modal-header">
                    <h3>{modalTitle}</h3>
                    <button className="ap-modal-close" onClick={onClose}>✕</button>
                </div>

                {feedback && (
                    <div className={`ap-feedback ap-feedback--${feedback.type}`}>{feedback.text}</div>
                )}

                {searchMode ? (
                    <div className="ap-search-container">
                        <button className="ap-btn-cancel" onClick={() => {
                            setSearchMode(false); setSearchQuery(''); setSearchResults([]); setSelectedList(null);
                        }}>
                            ← Volver a listas
                        </button>
                        <input
                            className="ap-input"
                            type="text"
                            placeholder="Busca por nombre o artista…"
                            value={searchQuery}
                            onChange={e => handleSearch(e.target.value)}
                            autoFocus
                        />
                        {searching && <p className="ap-modal-loading">Buscando…</p>}
                        {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                            <p className="ap-modal-empty">Sin resultados</p>
                        )}
                        <div className="ap-album-results">
                            {searchResults.map(album => (
                                <div key={album.spotifyAlbumId} className="ap-album-item" onClick={() => handleSelectAlbum(album)}>
                                    {album.coverUrl
                                        ? <img src={album.coverUrl} alt={album.title} className="ap-album-cover" />
                                        : <div className="ap-album-cover-placeholder">♪</div>
                                    }
                                    <div className="ap-album-info">
                                        <div className="ap-album-title">{album.title}</div>
                                        <div className="ap-album-artist">{album.artist}</div>
                                        {album.releaseYear && <div className="ap-album-year">{album.releaseYear}</div>}
                                    </div>
                                    <div className="ap-album-add">+ Añadir</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {loadingLists ? (
                            <p className="ap-modal-loading">Cargando tus listas…</p>
                        ) : (
                            <>
                                {lists.length === 0 && !creatingNew && (
                                    <p className="ap-modal-empty">No tienes listas aún. ¡Crea una!</p>
                                )}
                                <div className="ap-modal-lists">
                                    {lists.map(list => (
                                        <div key={list.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button
                                                className="ap-modal-list-item"
                                                style={{ flex: 1 }}
                                                onClick={() => spotifyAlbumId
                                                    ? handleAddToList(list.id)
                                                    : (setSelectedList(list.id), setSearchMode(true))
                                                }
                                            >
                                                <span className="ap-modal-list-name">{list.name}</span>
                                                {list.description && <span className="ap-modal-list-desc">{list.description}</span>}
                                            </button>
                                            {!spotifyAlbumId && (
                                                <button className="ap-btn-search" onClick={() => { setSelectedList(list.id); setSearchMode(true); }} title="Buscar álbumes">
                                                    ⌕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {!creatingNew ? (
                                    <button className="ap-btn-new-list" onClick={() => setCreatingNew(true)}>
                                        + Crear nueva lista
                                    </button>
                                ) : (
                                    <div className="ap-new-list-form">
                                        <h4>Nueva lista</h4>
                                        <input className="ap-input" type="text" placeholder="Nombre *" value={newName} onChange={e => setNewName(e.target.value)} maxLength={100} autoFocus />
                                        <textarea className="ap-textarea" placeholder="Descripción (opcional)" value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={2} />
                                        <div className="ap-form-buttons">
                                            <button className="ap-btn-save" onClick={handleCreateAndAdd} disabled={savingNew}>
                                                {savingNew ? 'Creando…' : spotifyAlbumId ? 'Crear y añadir' : 'Crear lista'}
                                            </button>
                                            <button className="ap-btn-cancel" onClick={() => { setCreatingNew(false); setNewName(''); setNewDescription(''); }}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AddToListModal;
