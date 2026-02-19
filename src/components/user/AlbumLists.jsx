import { useState, useEffect } from 'react';
import { apiFetch } from '../../api';

const AlbumLists = ({ spotifyAlbumId }) => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copyingId, setCopyingId] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const res = await apiFetch(`/listalbum/album/${spotifyAlbumId}`);
                const data = await res.json();
                setLists(data || []);
            } catch (err) {
                console.error('Error cargando listas:', err);
                setLists([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLists();
    }, [spotifyAlbumId]);

    const showFeedback = (type, text) => {
        setFeedback({ type, text });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleCopyList = async (item) => {
        if (!currentUser) return;
        setCopyingId(item.idListAlbum);
        try {
            // 1. Crear nueva lista con el mismo nombre
            const createRes = await apiFetch('/soundlist/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { idUser: currentUser.idUser },
                    name: item.listName,
                    description: `Copiada de ${item.listOwnerUsername}`
                })
            });
            const createResult = await createRes.json();
            if (createResult <= 0) {
                showFeedback('error', 'No se pudo crear la lista.');
                return;
            }

            // 2. Obtener la lista recién creada para saber su id
            const myListsRes = await apiFetch(`/soundlist/user/${currentUser.username}`);
            const myLists = await myListsRes.json();
            const newList = myLists.find(l => l.name === item.listName);
            if (!newList) {
                showFeedback('error', 'Error al localizar la lista creada.');
                return;
            }

            // 3. Obtener todos los álbumes de la lista original
            const albumsRes = await apiFetch(`/listalbum/bylist/${item.listId}`);
            const albums = await albumsRes.json();

            // 4. Añadir cada álbum a la nueva lista
            for (const album of albums) {
                await apiFetch('/listalbum', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        identificadorLista: newList.id,
                        albumSpotifyId: album.albumSpotifyId
                    })
                });
            }

            showFeedback('success', `Lista "${item.listName}" copiada con ${albums.length} álbumes.`);
        } catch (err) {
            console.error('Error copiando lista:', err);
            showFeedback('error', 'Error de conexión.');
        } finally {
            setCopyingId(null);
        }
    };

    if (loading) return <p className="ap-no-reviews">Cargando listas...</p>;

    const myLists = currentUser ? lists.filter(l => l.listOwnerUsername === currentUser.username) : [];
    const otherLists = currentUser ? lists.filter(l => l.listOwnerUsername !== currentUser.username) : lists;

    return (
        <div className="ap-reviews">
            <h3>Listas</h3>

            {feedback && (
                <div style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '16px',
                    background: feedback.type === 'success' ? '#1a2e1a' : '#2e1a1a',
                    color: feedback.type === 'success' ? '#4caf50' : '#f44336',
                    border: `1px solid ${feedback.type === 'success' ? '#2d5a2d' : '#5a2d2d'}`
                }}>
                    {feedback.text}
                </div>
            )}

            {lists.length === 0 ? (
                <p className="ap-no-reviews">Este álbum no está en ninguna lista todavía.</p>
            ) : (
                <>
                    {/* MIS LISTAS */}
                    {currentUser && myLists.length === 0 && (
                        <div className="ap-review-card ap-my-empty">
                            <span className="ap-username">{currentUser.username}</span>
                            <p className="ap-no-review-text">No has añadido este álbum a ninguna lista</p>
                        </div>
                    )}

                    {currentUser && myLists.map(item => (
                        <div key={item.idListAlbum} className="ap-review-card ap-my-card">
                            <div className="ap-review-top">
                                <span className="ap-username">
                                    📝 {item.listName} <span className="ap-you-badge">tú</span>
                                </span>
                            </div>
                            <span className="ap-date">
                                Añadido el {new Date(item.addedAt).toLocaleDateString('es-ES')}
                            </span>
                        </div>
                    ))}

                    {/* LISTAS DE OTROS */}
                    {otherLists.map(item => (
                        <div key={item.idListAlbum} className="ap-review-card">
                            <div className="ap-review-top">
                                <span className="ap-username">📝 {item.listName}</span>
                                {currentUser && (
                                    <button
                                        className="ap-btn-edit"
                                        onClick={() => handleCopyList(item)}
                                        disabled={copyingId === item.idListAlbum}
                                    >
                                        {copyingId === item.idListAlbum ? 'Copiando...' : 'Copiar lista'}
                                    </button>
                                )}
                            </div>
                            <span className="ap-date">
                                Añadido el {new Date(item.addedAt).toLocaleDateString('es-ES')}
                            </span>
                            <span className="ap-date">
                                Por {item.listOwnerUsername}
                            </span>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default AlbumLists;
