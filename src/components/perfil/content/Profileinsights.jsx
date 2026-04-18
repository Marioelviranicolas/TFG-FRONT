import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api';
import './ProfileInsights.css';

const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
};

export default function ProfileInsights({ username }) {
    const [data, setData]     = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate            = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res     = await apiFetch(`/reviews/user/${username}`);
                const reviews = await res.json();

                if (!reviews || reviews.length === 0) {
                    setData(null);
                    return;
                }

                // ── Media de puntuación ──
                const avg = reviews.reduce((acc, r) => acc + parseFloat(r.rating), 0) / reviews.length;

                // ── Artista más reseñado ──
                const artistCount = {};
                reviews.forEach(r => {
                    const a = r.album?.artist;
                    if (a) artistCount[a] = (artistCount[a] || 0) + 1;
                });
                const topArtist = Object.entries(artistCount).sort((a, b) => b[1] - a[1])[0];

                // ── Año más activo ──
                const yearCount = {};
                reviews.forEach(r => {
                    const date = r.createdAt;
                    let year;
                    if (Array.isArray(date)) year = date[0];
                    else if (date) year = new Date(date).getFullYear();
                    if (year) yearCount[year] = (yearCount[year] || 0) + 1;
                });
                const topYear = Object.entries(yearCount).sort((a, b) => b[1] - a[1])[0];

                // ── Mejor review (rating más alto, con comentario) ──
                const withComment = reviews.filter(r => r.comment && r.comment.trim());
                const bestReview  = withComment.sort((a, b) => b.rating - a.rating)[0] || reviews[0];

                // ── Distribución de ratings (1-5) ──
                const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                reviews.forEach(r => {
                    const rounded = Math.round(parseFloat(r.rating));
                    if (dist[rounded] !== undefined) dist[rounded]++;
                });
                const maxDist = Math.max(...Object.values(dist), 1);

                // ── Álbum más reciente reseñado ──
                const sorted  = [...reviews].sort((a, b) => {
                    const da = Array.isArray(a.createdAt) ? new Date(...a.createdAt) : new Date(a.createdAt);
                    const db = Array.isArray(b.createdAt) ? new Date(...b.createdAt) : new Date(b.createdAt);
                    return db - da;
                });
                const latest = sorted[0];

                setData({ avg, topArtist, topYear, bestReview, dist, maxDist, total: reviews.length, latest });
            } catch {
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [username]);

    if (loading) return null;
    if (!data)   return null;

    const { avg, topArtist, topYear, bestReview, dist, maxDist, total, latest } = data;

    return (
        <div className="pi-root">
            <span className="pp-section-title">Estadísticas</span>

            {/* ── Fila superior: 3 métricas grandes ── */}
            <div className="pi-metrics">

                <div className="pi-metric">
                    <span className="pi-metric__value">{avg.toFixed(2)}</span>
                    <span className="pi-metric__stars">{renderStars(avg)}</span>
                    <span className="pi-metric__label">Media de puntuación</span>
                </div>

                {topArtist && (
                    <div className="pi-metric pi-metric--artist">
                        <span className="pi-metric__tag">Artista favorito</span>
                        <span className="pi-metric__value pi-metric__value--md">{topArtist[0]}</span>
                        <span className="pi-metric__label">{topArtist[1]} reseña{topArtist[1] !== 1 ? 's' : ''}</span>
                    </div>
                )}

                {topYear && (
                    <div className="pi-metric">
                        <span className="pi-metric__tag">Año más activo</span>
                        <span className="pi-metric__value">{topYear[0]}</span>
                        <span className="pi-metric__label">{topYear[1]} reseña{topYear[1] !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* ── Distribución de ratings ── */}
            <div className="pi-dist">
                <p className="pi-dist__title">Distribución de puntuaciones</p>
                <div className="pi-dist__bars">
                    {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="pi-dist__row">
                            <span className="pi-dist__star">{star}★</span>
                            <div className="pi-dist__bar-wrap">
                                <div
                                    className="pi-dist__bar-fill"
                                    style={{ width: `${(dist[star] / maxDist) * 100}%` }}
                                />
                            </div>
                            <span className="pi-dist__count">{dist[star]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Mejor reseña ── */}
            {bestReview && (
                <div
                    className="pi-best"
                    onClick={() => navigate(`/album/${bestReview.album?.spotifyAlbumId}`)}
                >
                    <span className="pi-best__tag">Reseña destacada</span>
                    <div className="pi-best__inner">
                        {bestReview.album?.coverUrl && (
                            <img
                                src={bestReview.album.coverUrl}
                                alt={bestReview.album.title}
                                className="pi-best__cover"
                            />
                        )}
                        <div className="pi-best__info">
                            <p className="pi-best__album">{bestReview.album?.title}</p>
                            <p className="pi-best__artist">{bestReview.album?.artist}</p>
                            <p className="pi-best__stars">{renderStars(bestReview.rating)}</p>
                            {bestReview.comment && (
                                <p className="pi-best__comment">"{bestReview.comment}"</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
