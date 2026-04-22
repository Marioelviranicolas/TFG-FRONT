import { useState, useEffect } from 'react';
import { apiFetch } from '../../../api';
import './AlbumTracks.css';

const formatDuration = (ms) => {
  if (!ms) return '--:--';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const openSpotifyPopup = (url) => {
  const w = 450, h = 600;
  const left = window.screenX + (window.innerWidth  - w) / 2;
  const top  = window.screenY + (window.innerHeight - h) / 2;
  window.open(url, 'spotify-player', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
};

export default function AlbumTracks({ spotifyAlbumId }) {
  const [tracks, setTracks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/spotify/album/${spotifyAlbumId}/tracks`, { skipRedirect: true })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setTracks(data || []))
      .catch(() => setError('No se pudieron cargar las pistas.'))
      .finally(() => setLoading(false));
  }, [spotifyAlbumId]);

  if (loading) return <p className="at-status">Cargando pistas…</p>;
  if (error)   return <p className="at-status at-error">{error}</p>;
  if (!tracks.length) return <p className="at-status">Sin pistas disponibles.</p>;

  return (
    <div className="at-container fade-in-section delay-5">
      <ol className="at-list">
        {tracks.map((track, i) => (
          <li
            key={track.id || i}
            className="at-row"
            onClick={() => track.spotifyUrl && openSpotifyPopup(track.spotifyUrl)}
          >
            <span className="at-num">{i + 1}</span>
            <span className="at-name">{track.name}</span>
            <span className="at-duration">{formatDuration(track.durationMs)}</span>
            {track.spotifyUrl && (
              <span className="at-play-hint">▶</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
