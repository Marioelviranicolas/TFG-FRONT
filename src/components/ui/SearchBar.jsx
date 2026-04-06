import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Cierra el dropdown al clicar fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda con debounce de 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setAlbums([]);
      setUsers([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const [albumsRes, usersRes] = await Promise.allSettled([
          apiFetch(`/spotify/search?query=${encodeURIComponent(query.trim())}`, { skipRedirect: true }),
          apiFetch(`/user/search?query=${encodeURIComponent(query.trim())}`, { skipRedirect: true }),
        ]);

        if (albumsRes.status === 'fulfilled' && albumsRes.value.ok) {
          const data = await albumsRes.value.json();
          setAlbums(data.slice(0, 5));
        } else {
          setAlbums([]);
        }

        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
          const data = await usersRes.value.json();
          setUsers(data.slice(0, 3));
        } else {
          setUsers([]);
        }

        setOpen(true);
      } catch {
        setAlbums([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleAlbumClick = (album) => {
    navigate(`/album/${album.spotifyAlbumId}`);
    setQuery('');
    setOpen(false);
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    setQuery('');
    setOpen(false);
  };

  const hasResults = albums.length > 0 || users.length > 0;

  return (
    <div className="sb-container" ref={containerRef}>
      <div className="sb-input-wrap">
        <svg className="sb-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          className="sb-input"
          type="text"
          placeholder="Buscar álbum o usuario..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
        />
        {loading && <span className="sb-spinner" />}
        {query && (
          <button className="sb-clear" onClick={() => { setQuery(''); setOpen(false); }}>
            ×
          </button>
        )}
      </div>

      {open && (
        <div className="sb-dropdown">
          {!hasResults && !loading && (
            <p className="sb-empty">Sin resultados para "{query}"</p>
          )}

          {albums.length > 0 && (
            <div className="sb-section">
              <span className="sb-section-label">Álbumes</span>
              {albums.map((album) => (
                <button
                  key={album.spotifyAlbumId}
                  className="sb-item"
                  onClick={() => handleAlbumClick(album)}
                >
                  {album.coverUrl
                    ? <img src={album.coverUrl} alt={album.title} className="sb-cover" />
                    : <div className="sb-cover-placeholder">♪</div>
                  }
                  <div className="sb-item-info">
                    <span className="sb-item-title">{album.title}</span>
                    <span className="sb-item-sub">
                      {album.artist}{album.releaseYear ? ` · ${album.releaseYear}` : ''}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {users.length > 0 && (
            <div className="sb-section">
              <span className="sb-section-label">Usuarios</span>
              {users.map((u) => (
                <button
                  key={u.username}
                  className="sb-item"
                  onClick={() => handleUserClick(u.username)}
                >
                  <img
                    src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.username}&size=40&background=ff5500&color=fff`}
                    alt={u.username}
                    className="sb-avatar"
                  />
                  <div className="sb-item-info">
                    <span className="sb-item-title">{u.username}</span>
                    {u.bio && (
                      <span className="sb-item-sub">
                        {u.bio.length > 60 ? u.bio.slice(0, 60) + '…' : u.bio}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
