// src/components/perfil/content/ListDetail.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, X } from 'lucide-react';
import { apiFetch } from '../../../api';

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnList, setIsOwnList] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const debounceRef = useRef(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  useEffect(() => {
    loadList();
    loadAlbums();
  }, [id]);

  const loadList = async () => {
    try {
      const response = await apiFetch(`/soundlist/${id}`);
      const data = await response.json();
      setList(data);
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      setIsOwnList(currentUser.username === data.username);
    } catch (error) {
      console.error('Error loading list:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlbums = async () => {
    try {
      const response = await apiFetch(`/listalbum/bylist/${id}`);
      const data = await response.json();
      setAlbums(data || []);
    } catch (error) {
      console.error('Error loading albums:', error);
      setAlbums([]);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await apiFetch(`/albums/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleAddAlbum = async (album) => {
    const alreadyIn = albums.some(a => a.album?.spotifyAlbumId === album.spotifyAlbumId);
    if (alreadyIn) { showFeedback('error', 'Este álbum ya está en la lista'); return; }
    try {
      const response = await apiFetch('/listalbum/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumSpotifyId: album.spotifyAlbumId, listId: parseInt(id) })
      });
      if (response.ok) {
        showFeedback('success', '¡Álbum añadido correctamente!');
        loadAlbums();
        setSearchQuery('');
        setSearchResults([]);
        setShowSearch(false);
      } else {
        showFeedback('error', 'Este álbum ya está en la lista');
      }
    } catch (error) {
      console.error('Error adding album:', error);
      showFeedback('error', 'Error al añadir el álbum');
    }
  };

  const handleRemoveAlbum = async (idListAlbum) => {
    if (!confirm('¿Eliminar este álbum de la lista?')) return;
    try {
      await apiFetch(`/listalbum/delete/${idListAlbum}`, { method: 'DELETE' });
      setAlbums(albums.filter(a => a.idListAlbum !== idListAlbum));
      showFeedback('success', 'Álbum eliminado de la lista');
    } catch (error) {
      console.error('Error removing album:', error);
    }
  };

  const handleDeleteList = async () => {
    if (!confirm('¿Eliminar esta lista? No se puede deshacer.')) return;
    try {
      await apiFetch(`/soundlist/delete/${id}`, { method: 'DELETE' });
      navigate('/profile');
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  if (loading) return <div className="pp-page"><p className="pp-loading">Cargando lista…</p></div>;
  if (!list)   return <div className="pp-page"><p className="pp-error">Lista no encontrada</p></div>;

  return (
    <div className="pp-page">

      {/* FEEDBACK TOAST */}
      {feedback && (
        <div className={`ap-feedback ap-feedback--${feedback.type}`}
          style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, minWidth: '260px' }}
        >
          {feedback.message}
        </div>
      )}

      {/* BACK */}
      <button className="pp-back-btn" onClick={() => navigate('/profile')}>
        ← Volver al perfil
      </button>

      {/* HEADER LISTA */}
      <div className="pp-header" style={{ alignItems: 'flex-start' }}>
        <div className="pp-info">
          <h1 className="pp-username"> {list.name}</h1>
          {list.description && <p className="pp-bio">{list.description}</p>}
          <p className="pp-email">
            Por {list.username} · {albums.length} álbumes
          </p>
          {isOwnList && (
            <div className="pp-header-actions">
              <button className="pp-btn-edit" onClick={() => setShowSearch(true)}>
                + Añadir álbum
              </button>
              <button
                className="pp-btn-home"
                style={{ borderColor: '#e04444', color: '#e04444' }}
                onClick={handleDeleteList}
              >
                <Trash2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Eliminar lista
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BUSCADOR */}
      {isOwnList && showSearch && (
        <div className="ap-modal-overlay" onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}>
          <div className="ap-modal" onClick={e => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>Buscar álbum</h3>
              <button className="ap-modal-close" onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}>
                <X size={16} />
              </button>
            </div>

            <div className="ap-search-container">
              <input
                className="ap-input"
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Busca un álbum o artista…"
                autoFocus
              />
              {searching && <p className="ap-modal-loading">Buscando…</p>}
              {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                <p className="ap-modal-empty">Sin resultados en la base de datos</p>
              )}
              <div className="ap-album-results">
                {searchResults.map(album => (
                  <div
                    key={album.spotifyAlbumId}
                    className="ap-album-item"
                    onClick={() => handleAddAlbum(album)}
                  >
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
          </div>
        </div>
      )}

      {/* ÁLBUMES */}
      <span className="pp-section-title">Álbumes ({albums.length})</span>

      {albums.length === 0 ? (
        <p className="pp-no-content">
          No hay álbumes en esta lista todavía.
          {isOwnList && ' Pulsa "+ Añadir álbum" para empezar.'}
        </p>
      ) : (
        albums.map(listAlbum => (
          <div key={listAlbum.idListAlbum} className="pp-review-card">
            {listAlbum.albumCoverUrl
              ? <img src={listAlbum.albumCoverUrl} alt={listAlbum.albumTitle} className="pp-review-cover" />
              : <div className="pp-review-cover-placeholder">♪</div>
            }
            <div className="pp-review-body">
              <span className="pp-review-album-title">{listAlbum.albumTitle}</span>
              <span className="pp-review-artist">{listAlbum.albumArtist}</span>
              {listAlbum.albumReleaseYear && (
                <span className="pp-review-date">{listAlbum.albumReleaseYear}</span>
              )}
            </div>
            {isOwnList && (
              <button
                className="ap-btn-delete"
                onClick={() => handleRemoveAlbum(listAlbum.idListAlbum)}
                title="Eliminar de la lista"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}