import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import styled from 'styled-components';
import './SearchBar.css';

const StyledSearch = styled.div`
  .input__container {
    margin-left: 120px;
    position: relative;
    background: #000000;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #525252;
    width: 100%;
    border-radius: 50px;
    transition: all 0.3s;
    box-shadow: 8px 8px 0 #000;
  }

  .input__container:hover {
    transform: rotateX(5deg) rotateY(0deg) scale(1.03);
    box-shadow: 10px 10px 0 #FF6B35, 15px 15px 0 #000;
  }

  .input__search {
    width: 100%;
    border: 2px solid #000;
    padding: 10px;
    font-size: 14px;
    outline: none;
    background: #111;
    color: #fff;
    border-radius: 50px;
    font-family: 'ClashDisplay-Medium';
  }

  .input__search::placeholder {
    color: #666;
  }

  .input__button__shadow {
    border: 2px solid #000;
    background: #000000;
    padding: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input__button__shadow svg {
    fill: #ffffff;
  }
`;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null); // Ref para el dropdown en el portal
  const navigate = useNavigate();

  // Calcular posición exacta considerando el scroll de la página
  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // Ajuste con scroll vertical
        left: rect.left + window.scrollX,      // Ajuste con scroll horizontal
        width: rect.width
      });
    }
  };

  useEffect(() => {
    if (open) updateDropdownPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleUpdate = () => updateDropdownPosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [open]);

  // Manejo de clicks externos corregido
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInsideInput = containerRef.current?.contains(e.target);
      const isInsideDropdown = dropdownRef.current?.contains(e.target);

      if (!isInsideInput && !isInsideDropdown) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lógica de búsqueda
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

  // Dropdown con position absolute y ref
  const dropdownContent = open && (
    <div 
      className="sb-dropdown" 
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 10000
      }}
    >
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
                src={u.avatarUrl || `https://ui-avatars.com{u.username}&size=40&background=ff5500&color=fff`}
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
  );

  return (
    <>
      <div className="sb-container" ref={containerRef}>
        <StyledSearch>
          <div className="input__container">
            <button
              className="input__button__shadow"
              onClick={() => query.trim().length >= 2 && setOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M10 2a8 8 0 105.29 14.29l4.7 4.7 1.41-1.41-4.7-4.7A8 8 0 0010 2z"/>
              </svg>
            </button>

            <input
              className="input__search"
              type="text"
              placeholder="Buscar álbum o usuario..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setOpen(true)}
            />

            {loading && <span className="sb-spinner" />}

            {query && (
              <button
                className="sb-clear"
                onClick={() => {
                  setQuery('');
                  setOpen(false);
                }}
              >
                ×
              </button>
            )}
          </div>
        </StyledSearch>
      </div>

      {/* Renderizado en el body para evitar cortes de overflow */}
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  );
}
