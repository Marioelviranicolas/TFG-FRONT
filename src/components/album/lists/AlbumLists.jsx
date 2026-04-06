// src/components/album/lists/AlbumLists.jsx
import { useState, useEffect } from 'react';
import { apiFetch } from '../../../api';
import ListCard from './ListCard';

const AlbumLists = ({ spotifyAlbumId }) => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copying, setCopying] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    useEffect(() => {
        apiFetch(`/listalbum/album/${spotifyAlbumId}`)
            .then(r => r.json())
            .then(data => setLists(data || []))
            .catch(() => setLists([]))
            .finally(() => setLoading(false));
    }, [spotifyAlbumId]);

    const showFeedback = (type, text) => {
        setFeedback({ type, text });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleCopy = async (item) => {
        if (!currentUser) return;
        setCopying(item.idListAlbum);
        try {
            const createRes = await apiFetch('/soundlist/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { idUser: currentUser.idUser },
                    name: item.listName,
                    description: `Copiada de ${item.listOwnerUsername}`
                })
            });
            const result = await createRes.json();
            if (result <= 0) return showFeedback('error', 'No se pudo crear la lista.');

            const myLists = await apiFetch(`/soundlist/user/${currentUser.username}`).then(r => r.json());
            const newList = myLists.find(l => l.name === item.listName);
            if (!newList) return showFeedback('error', 'Error al localizar la lista creada.');

            const albums = await apiFetch(`/listalbum/bylist/${item.listId}`).then(r => r.json());
            for (const album of albums) {
                await apiFetch('/listalbum', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identificadorLista: newList.id, albumSpotifyId: album.albumSpotifyId })
                });
            }
            showFeedback('success', `"${item.listName}" copiada con ${albums.length} álbumes.`);
        } catch {
            showFeedback('error', 'Error de conexión.');
        } finally {
            setCopying(null);
        }
    };

    if (loading) return <p className="ap-no-reviews">Cargando listas…</p>;

    const myLists    = currentUser ? lists.filter(l => l.listOwnerUsername === currentUser.username) : [];
    const otherLists = currentUser ? lists.filter(l => l.listOwnerUsername !== currentUser.username) : lists;

    return (
        <div className="ap-reviews-section">
            <span className="ap-section-title">Listas</span>

            {feedback && (
                <div className={`ap-feedback ap-feedback--${feedback.type}`}>{feedback.text}</div>
            )}

            {lists.length === 0 ? (
                <p className="ap-no-reviews">Este álbum no está en ninguna lista todavía.</p>
            ) : (
                <>
                    {currentUser && myLists.length === 0 && (
                        <div className="ap-list-card ap-list-card--mine" style={{ opacity: 0.5 }}>
                            <span className="ap-username">{currentUser.username}</span>
                            <p className="ap-no-review-text">No has añadido este álbum a ninguna lista</p>
                        </div>
                    )}
                    {myLists.map(item => (
                        <ListCard key={item.idListAlbum} item={item} isOwn currentUser={currentUser} />
                    ))}
                    {otherLists.map(item => (
                        <ListCard key={item.idListAlbum} item={item} isOwn={false} currentUser={currentUser} onCopy={handleCopy} copying={copying} />
                    ))}
                </>
            )}
        </div>
    );
};

export default AlbumLists;
