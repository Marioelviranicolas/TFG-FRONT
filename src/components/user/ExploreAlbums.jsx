// src/components/user/ExploreAlbums.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import UserSlideMenu from './UserSlideMenu';
import SearchBar from '../ui/SearchBar';
import Footer from '../layout/public/Footer';
import './ExploreAlbums.css';

// ─── Géneros ──────────────────────────────────────────────────────────────────
const GENRES = [
    { label: 'Todo',        query: null },
    { label: 'Hip-Hop',     query: 'hip hop' },
    { label: 'Rock',        query: 'rock' },
    { label: 'Electrónica', query: 'electronic' },
    { label: 'Pop',         query: 'pop' },
    { label: 'Jazz',        query: 'jazz' },
    { label: 'R&B',         query: 'r&b soul' },
    { label: 'Indie',       query: 'indie alternative' },
    { label: 'Metal',       query: 'metal' },
    { label: 'Clásica',     query: 'classical' },
];

// ─── Tarjeta de álbum ─────────────────────────────────────────────────────────
const AlbumCard = ({ album }) => {
    const navigate = useNavigate();
    const id = album.spotifyAlbumId || album.id;

    return (
        <div className="ea-card" onClick={() => navigate(`/album/${id}`)}>
            <div className="ea-card__img-wrap">
                {album.coverUrl
                    ? <img src={album.coverUrl} alt={album.title} className="ea-card__img" />
                    : <div className="ea-card__placeholder">♪</div>
                }
                <div className="ea-card__overlay">▶</div>
            </div>
            <div className="ea-card__info">
                <p className="ea-card__title">{album.title}</p>
                <p className="ea-card__artist">
                    {album.artist}
                    {album.releaseYear && <span className="ea-card__year"> · {album.releaseYear}</span>}
                </p>
            </div>
        </div>
    );
};

// ─── Skeleton de carga ────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <div className="ea-skeleton-row">
        {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="ea-skeleton-card" />
        ))}
    </div>
);

// ─── Carrusel horizontal ──────────────────────────────────────────────────────
const AlbumCarousel = ({ title, albums, loading }) => {
    const ref = useRef(null);
    const scroll = dir => ref.current?.scrollBy({ left: dir * 700, behavior: 'smooth' });

    return (
        <section className="ea-section">
            <div className="ea-section-header">
                <h2 className="ea-section-title">{title}</h2>
            </div>
            {loading ? <SkeletonRow /> : albums.length === 0 ? (
                <p className="ea-empty">Sin resultados</p>
            ) : (
                <div className="ea-carousel-outer">
                    <div className="ea-carousel-wrapper" ref={ref}>
                        <div className="ea-carousel-track">
                            {albums.map((a, i) => (
                                <AlbumCard key={a.spotifyAlbumId || i} album={a} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

// ─── Grid de búsqueda ─────────────────────────────────────────────────────────
const SearchGrid = ({ albums, loading, query }) => {
    if (loading) return (
        <div className="ea-search-grid">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="ea-skeleton-card ea-skeleton-card--grid" />
            ))}
        </div>
    );
    if (!albums.length) return (
        <div className="ea-empty-state">
            <p className="ea-empty-state__icon">🎵</p>
            <p className="ea-empty-state__text">No encontramos álbumes para "{query}"</p>
        </div>
    );
    return (
        <div className="ea-search-grid">
            {albums.map((a, i) => <AlbumCard key={a.spotifyAlbumId || i} album={a} />)}
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ExploreAlbums() {
    const navigate = useNavigate();

    // Búsqueda
    const [searchQuery, setSearchQuery]     = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching]         = useState(false);
    const searchDebounce                    = useRef(null);

    // Géneros
    const [activeGenre, setActiveGenre]     = useState(GENRES[0]);
    const [genreAlbums, setGenreAlbums]     = useState([]);
    const [genreLoading, setGenreLoading]   = useState(false);

    // Caché local — dos secciones
    const [cachedAlbums, setCachedAlbums]   = useState([]);
    const [cacheLoading, setCacheLoading]   = useState(true);

    // ── Caché local ──
    useEffect(() => {
        apiFetch('/albums/todos')
            .then(r => r.json())
            .then(data => {
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setCachedAlbums(shuffled);
            })
            .catch(() => {})
            .finally(() => setCacheLoading(false));
    }, []);

    // ── Género via Spotify ──
    useEffect(() => {
        if (!activeGenre.query) { setGenreAlbums([]); return; }
        setGenreLoading(true);
        apiFetch(`/spotify/search?query=${encodeURIComponent(activeGenre.query)}`)
            .then(r => r.json())
            .then(data => setGenreAlbums(data || []))
            .catch(() => setGenreAlbums([]))
            .finally(() => setGenreLoading(false));
    }, [activeGenre]);

    // ── Búsqueda con debounce ──
    const handleSearch = (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        clearTimeout(searchDebounce.current);

        if (!q.trim()) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        searchDebounce.current = setTimeout(async () => {
            try {
                const res  = await apiFetch(`/spotify/search?query=${encodeURIComponent(q.trim())}`);
                const data = await res.json();
                setSearchResults(data || []);
            } catch {
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 350);
    };

    const clearSearch = () => {
        clearTimeout(searchDebounce.current);
        setSearchQuery('');
        setSearchResults([]);
        setSearching(false);
    };

    const isSearchActive = searchQuery.trim().length > 0;

    // Dos secciones distintas con la caché
    const section1 = cachedAlbums.slice(0, 20);
    const section2 = [...cachedAlbums].reverse().slice(0, 20);

    return (
        <div className="ea-page">

            {/* Navbar */}
                <div className='userhome-header'>
                <h1 className='title' onClick={() => navigate('/user-home')}>CRATE</h1>
                <SearchBar />
                </div>
          

            <div className="ea-content">

                {/* Hero — solo cuando no buscas */}
                {!isSearchActive && (
                    <>
                        <div className="ea-hero">
                            <h1 className="ea-hero-title">Explorar música</h1>
                            <p className="ea-hero-sub">
                                Descubre álbumes, encuentra nuevos artistas y lee lo que opina la comunidad
                            </p>
                        </div>

                        {/* Filtros de género */}
                        <div className="ea-genres">
                            {GENRES.map(g => (
                                <button
                                    key={g.label}
                                    className={`ea-genre-btn ${activeGenre.label === g.label ? 'ea-genre-btn--active' : ''}`}
                                    onClick={() => setActiveGenre(g)}
                                >
                                    {g.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* BÚSQUEDA */}
                {isSearchActive ? (
                    <section className="ea-section">
                        <div className="ea-section-header">
                            <h2 className="ea-section-title">
                                {searching ? 'Buscando...' : `Resultados para "${searchQuery}"`}
                            </h2>
                            {!searching && (
                                <span className="ea-section-count">{searchResults.length} álbumes</span>
                            )}
                        </div>
                        <SearchGrid albums={searchResults} loading={searching} query={searchQuery} />
                    </section>

                ) : activeGenre.query ? (
                    /* GÉNERO */
                    <AlbumCarousel
                        title={`Lo mejor del ${activeGenre.label}`}
                        albums={genreAlbums}
                        loading={genreLoading}
                    />
                ) : (
                    /* INICIO — caché local */
                    <>
                        <AlbumCarousel
                            title="En la comunidad"
                            albums={section1}
                            loading={cacheLoading}
                        />
                        <AlbumCarousel
                            title="Puede que te guste"
                            albums={section2}
                            loading={cacheLoading}
                        />
                    </>
                )}
            </div>
            <Footer />
            <UserSlideMenu />
        </div>
    );
}
