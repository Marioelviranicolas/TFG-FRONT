import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, X } from 'lucide-react';
import { apiFetch } from '../../api';

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnList, setIsOwnList] = useState(false);

  // Buscador (solo caché por ahora)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [feedback, setFeedback] = useState(null);


  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000); // Desaparece en 3 segundos
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

  // Busca SOLO en albums_cache por ahora
  // Cuando tengas Spotify cambia la URL a /spotify/search
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);

      // Por ahora busca en caché local
      // TODO: cambiar a /spotify/search?query=... cuando tengas credenciales
      const response = await apiFetch(`/albums/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddAlbum = async (album) => {
    // Verificar si ya está en la lista
    const alreadyIn = albums.some(a => a.album?.spotifyAlbumId === album.spotifyAlbumId);
    if (alreadyIn) {
      showFeedback('error', 'Este álbum ya está en la lista');
      return;
    }

    try {
      const response = await apiFetch('/listalbum/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumSpotifyId: album.spotifyAlbumId,
          listId: parseInt(id)
        })
      });

      if (response.ok) {
        showFeedback('success', '¡Álbum añadido correctamente!');
        loadAlbums();
        setSearchQuery('');
        setSearchResults([]);
        setShowSearch(false);
      }else if (result === -1) {
                showFeedback('error', 'Este álbum ya está en la lista');
            }
    } catch (error) {
      console.error('Error adding album:', error);
      showFeedback('error', 'Album ya existe');
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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;
  }

  if (!list) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Lista no encontrada</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
       {feedback && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          borderRadius: '8px',
          backgroundColor: feedback.type === 'success' ? '#1a2e1a' : '#2e1a1a',
          color: feedback.type === 'success' ? '#4caf50' : '#f44336',
          border: `1px solid ${feedback.type === 'success' ? '#2d5a2d' : '#5a2d2d'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          fontWeight: 'bold',
          fontSize: '14px',
          animation: 'slideIn 0.3s ease-out',
          minWidth: '250px'
        }}>
          {feedback.message}
        </div>
      )}
      
      {/* Botón volver */}
      <button
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', background: 'none',
          border: '1px solid #ddd', borderRadius: '8px',
          cursor: 'pointer', color: '#666', marginBottom: '20px'
        }}
      >
        <ArrowLeft size={20} />
        Volver al perfil
      </button>

      {/* Header de la lista */}
      <div style={{
        padding: '20px', backgroundColor: '#f9f9f9',
        borderRadius: '12px', marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>
              📝 {list.name}
            </h1>
            {list.description && (
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{list.description}</p>
            )}
            <small style={{ color: '#999' }}>
              Por {list.username} · {albums.length} álbumes ·{' '}
              {new Date(list.createdAt).toLocaleDateString('es-ES')}
            </small>
          </div>

          {/* Eliminar lista */}
          {isOwnList && (
            <button
              onClick={handleDeleteList}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', backgroundColor: '#fff',
                border: '1px solid #ddd', borderRadius: '8px',
                cursor: 'pointer', color: '#c33'
              }}
            >
              <Trash2 size={16} />
              Eliminar lista
            </button>
          )}
        </div>
      </div>

      {/* Buscador - solo si es tu lista */}
      {isOwnList && (
        <div style={{ marginBottom: '20px' }}>
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              style={{
                padding: '10px 20px', backgroundColor: '#FF6B35',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              + Añadir álbum
            </button>
          ) : (
            <div style={{
              padding: '20px', border: '2px solid #FF6B35',
              borderRadius: '12px', backgroundColor: '#fff'
            }}>
              {/* Header buscador */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0 }}>Buscar álbum</h3>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Busca un álbum o artista..."
                autoFocus
                style={{
                  width: '100%', padding: '12px',
                  border: '2px solid #ddd', borderRadius: '8px',
                  fontSize: '1rem', marginBottom: '15px'
                }}
              />

              {searching && <p style={{ color: '#666' }}>Buscando...</p>}

              {/* Resultados */}
              {searchResults.length > 0 && (
                <div style={{
                  display: 'grid', gap: '10px',
                  maxHeight: '400px', overflowY: 'auto'
                }}>
                  {searchResults.map((album) => (
                    <div
                      key={album.spotifyAlbumId}
                      onClick={() => handleAddAlbum(album)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '15px',
                        padding: '10px', border: '1px solid #eee',
                        borderRadius: '8px', cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {album.coverUrl ? (
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '4px',
                          backgroundColor: '#ddd', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                        }}>
                          🎵
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{album.title}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{album.artist}</div>
                        {album.releaseYear && (
                          <div style={{ color: '#999', fontSize: '0.8rem' }}>{album.releaseYear}</div>
                        )}
                      </div>
                      <div style={{ color: '#FF6B35', fontWeight: 'bold' }}>
                        + Añadir
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                <p style={{ color: '#666' }}>No se encontraron resultados en la base de datos</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Álbumes de la lista */}
      <div>
        <h2 style={{ marginBottom: '15px' }}>Álbumes ({albums.length})</h2>

        {albums.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p style={{ fontSize: '3rem' }}>🎵</p>
            <p>No hay álbumes en esta lista todavía</p>
            {isOwnList && <p>Pulsa "Añadir álbum" para empezar</p>}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {albums.map((listAlbum) => (
              <div
                key={listAlbum.idListAlbum}
                style={{
                  display: 'flex', alignItems: 'center', gap: '15px',
                  padding: '15px', border: '1px solid #ddd', borderRadius: '8px'
                }}
              >
                {/* CAMBIO AQUÍ: albumCoverUrl en vez de album.coverUrl */}
                {listAlbum.albumCoverUrl ? (
                  <img
                    src={listAlbum.albumCoverUrl}
                    alt={listAlbum.albumTitle}
                    style={{ width: '70px', height: '70px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '70px', height: '70px', borderRadius: '6px',
                    backgroundColor: '#ddd', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
                  }}>
                    🎵
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  {/* CAMBIO AQUÍ: albumTitle en vez de album.title */}
                  <h3 style={{ margin: '0 0 5px 0' }}>{listAlbum.albumTitle}</h3>

                  {/* CAMBIO AQUÍ: albumArtist en vez de album.artist */}
                  <p style={{ margin: '0 0 3px 0', color: '#666' }}>{listAlbum.albumArtist}</p>

                  {/* CAMBIO AQUÍ: albumReleaseYear (sin '?' porque no es objeto anidado) */}
                  {listAlbum.albumReleaseYear && (
                    <small style={{ color: '#999' }}>{listAlbum.albumReleaseYear}</small>
                  )}
                </div>

                {isOwnList && (
                  <button
                    onClick={() => handleRemoveAlbum(listAlbum.idListAlbum)}
                    style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#999', padding: '5px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#c33'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}