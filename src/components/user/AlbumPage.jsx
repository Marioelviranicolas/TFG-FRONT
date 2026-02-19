// src/components/user/AlbumPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './AlbumPage.css';
import AlbumReviews from './AlbumReviews';
import AlbumLists from './AlbumLists';
import AddToListModal from './AddToListModal';

const AlbumPage = () => {
    const { spotifyAlbumId } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myReview, setMyReview] = useState(null);
    const [showListModal, setShowListModal] = useState(false);
    const [activeTab, setActiveTab] = useState('reviews');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [albumRes, reviewsRes, avgRes] = await Promise.all([
                    apiFetch(`/albums/id/${spotifyAlbumId}`),
                    apiFetch(`/reviews/album/${spotifyAlbumId}`),
                    apiFetch(`/reviews/average/${spotifyAlbumId}`)
                ]);

                const [albumData, reviewsData, avgData] = await Promise.all([
                    albumRes.json(),
                    reviewsRes.json(),
                    avgRes.json()
                ]);

                setAlbum(albumData);
                setAverage(avgData);

                if (currentUser) {
                    const myReviewData = reviewsData.find(r => r.user.username === currentUser.username);
                    setMyReview(myReviewData || null);
                    setReviews(reviewsData.filter(r => r.user.username !== currentUser.username));
                } else {
                    setReviews(reviewsData);
                }
            } catch (err) {
                console.error('Error cargando álbum:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [spotifyAlbumId]);

    if (loading) return <div className="ap-loading">Cargando...</div>;
    if (!album) return <div className="ap-loading">Álbum no encontrado</div>;

    return (
        <div className="ap-page">
            <button className="ap-back-btn" onClick={() => navigate(-1)}>← Volver</button>

            <div className="ap-header">
                <img src={album.coverUrl} alt={album.title} className="ap-cover" />
                <div className="ap-info">
                    <h1>{album.title}</h1>
                    <h2>{album.artist}</h2>
                    {average !== null && (
                        <div className="ap-average">
                            <span className="ap-average-number">{Number(average).toFixed(1)}</span>
                            <span className="ap-average-label"> / 5 · {reviews.length + (myReview ? 1 : 0)} reviews</span>
                        </div>
                    )}
                    {currentUser && (
                        <button className="ap-btn-add-list" onClick={() => setShowListModal(true)}>
                            + Añadir a lista
                        </button>
                    )}
                </div>
            </div>

            {/* MODAL COMPARTIDO */}
            {showListModal && (
                <AddToListModal
                    spotifyAlbumId={spotifyAlbumId}
                    currentUser={currentUser}
                    onClose={() => setShowListModal(false)}
                    onSuccess={() => {
                        setShowListModal(false);
                        // Cambiar al tab de listas para ver el cambio
                        setActiveTab('lists');
                    }}
                />
            )}

            {/* TABS */}
            <div className="ap-tabs">
                <button
                    className={`ap-tab ${activeTab === 'reviews' ? 'ap-tab--active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
                <button
                    className={`ap-tab ${activeTab === 'lists' ? 'ap-tab--active' : ''}`}
                    onClick={() => setActiveTab('lists')}
                >
                    Listas
                </button>
            </div>

            {activeTab === 'reviews' && (
                <AlbumReviews
                    spotifyAlbumId={spotifyAlbumId}
                    currentUser={currentUser}
                    reviews={reviews}
                    myReview={myReview}
                    setMyReview={setMyReview}
                    setReviews={setReviews}
                    setAverage={setAverage}
                />
            )}

            {activeTab === 'lists' && (
                <AlbumLists spotifyAlbumId={spotifyAlbumId} />
            )}
        </div>
    );
};

export default AlbumPage;