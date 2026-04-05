import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './FavoriteAlbums.css';

const FAVORITES_LIST_NAME = 'Favoritos';
const MAX_FAVORITES = 5;

export default function FavoriteAlbums({ username, isOwnProfile }) {
  const [listId, setListId]       = useState(null);
  const [albums, setAlbums]       = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);
  const navigate    = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    loadFavorites();
  }, [username]);

  const loadFavorites = async () => {
    try {
      const res  = await apiFetch(`/soundlist/user/${username}`);
      const lists = await res.json();
      const favList = lists.find(l => l.name === FAVORITES_LIST_NAME);
      if (!favList) return;
      setListId(favList.id);
      const albumsRes  = await apiFetch(`/listalbum/bylist/${favList.id}`);
      const albumsData = await albumsRes.json();
      setAlbums(albumsData || []);
    } catch {
      setAlbums([]);
    }
  };

  // Crea la lista Favoritos si no existe aún y devuelve su id
  const getOrCreateList = async () => {
    if (listId) return listId;
    const res = await apiFetch('/soundlist/insert', {
      method: 'POST',
      body: JSON.stringify({
        user: { idUser: currentUser.idUser },
        name: FAVORITES_LIST_NAME,
        description: 'Mis álbumes favoritos'
      })
    });
    await res.json();
    const listsRes  = await apiFetch(`/soundlist/user/${username}`);
    const lists     = await listsRes.json();
    const favList   = lists.find(l => l.name === FAVORITES_LIST_NAME);
    setListId(favList.id);
    return favList.id;
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await apiFetch(`/albums/search?query=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResults(data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleAdd = async (album) => {
    try {
      const id = await getOrCreateList();
      const res = await apiFetch('/listalbum/add', {
        method: 'POST',
        body: JSON.stringify({ albumSpotifyId: album.spotifyAlbumId, listId: id })
      });
      if (res.ok) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        loadFavorites();
      }
    } catch { /* silent */ }
  };

  const handleRemove = async (e, idListAlbum) => {
    e.stopPropagation();
    try {
      await apiFetch(`/listalbum/delete/${idListAlbum}`, { method: 'DELETE' });
      setAlbums(prev => prev.filter(a => a.idListAlbum !== idListAlbum));
    } catch { /* silent */ }
  };

  const slots = Array.from({ length: MAX_FAVORITES }, (_, i) => albums[i] || null);

  return (
    <div className="fav-root">
      <span className="fav-label">Favoritos</span>

      <div className="fav-grid">
        {slots.map((album, i) =>
          album ? (
            <div
              key={album.idListAlbum}
              className="fav-slot fav-slot--filled"
              onClick={() => navigate(`/album/${album.albumSpotifyId || album.album?.spotifyAlbumId}`)}
              title={album.albumTitle}
            >
              <img
                src={album.albumCoverUrl}
                alt={album.albumTitle}
                className="fav-cover"
              />
              {isOwnProfile && (
                <button
                  className="fav-remove"
                  onClick={(e) => handleRemove(e, album.idListAlbum)}
                  title="Quitar"
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            isOwnProfile ? (
              <button
                key={`empty-${i}`}
                className="fav-slot fav-slot--empty"
                onClick={() => setShowSearch(true)}
                title="Añadir favorito"
              >
                +
              </button>
            ) : (
              <div key={`empty-${i}`} className="fav-slot fav-slot--empty fav-slot--readonly" />
            )
          )
        )}
      </div>

      {showSearch && (
        <div className="fav-modal-overlay" onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}>
          <div className="fav-modal" onClick={e => e.stopPropagation()}>
            <div className="fav-modal-header">
              <span className="fav-modal-title">Añadir favorito</span>
              <button className="fav-modal-close" onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}>×</button>
            </div>
            <input
              className="fav-modal-input"
              type="text"
              placeholder="Busca un álbum o artista…"
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
            {searching && <p className="fav-modal-status">Buscando…</p>}
            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
              <p className="fav-modal-status">Sin resultados</p>
            )}
            <div className="fav-modal-results">
              {searchResults.map(album => (
                <button
                  key={album.spotifyAlbumId}
                  className="fav-result-item"
                  onClick={() => handleAdd(album)}
                >
                  {album.coverUrl
                    ? <img src={album.coverUrl} alt={album.title} className="fav-result-cover" />
                    : <div className="fav-result-cover fav-result-cover--placeholder">♪</div>
                  }
                  <div className="fav-result-info">
                    <span className="fav-result-title">{album.title}</span>
                    <span className="fav-result-artist">{album.artist}{album.releaseYear ? ` · ${album.releaseYear}` : ''}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
