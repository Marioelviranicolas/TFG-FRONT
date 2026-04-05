// src/components/album/AlbumPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './album.css';

import AlbumHeader    from './AlbumHeader';
import AlbumReviews   from './reviews/AlbumReviews';
import AlbumLists     from './lists/AlbumLists';
import AddToListModal from './modal/AddToListModal';
import SearchBar      from '../ui/SearchBar';
import UserSlideMenu  from '../user/UserSlideMenu';

const AlbumPage = () => {
    const { spotifyAlbumId } = useParams();
    const navigate = useNavigate();

    const [album,     setAlbum]     = useState(null);
    const [reviews,   setReviews]   = useState([]);
    const [average,   setAverage]   = useState(null);
    const [myReview,  setMyReview]  = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [showModal, setShowModal] = useState(false);
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
                    albumRes.json(), reviewsRes.json(), avgRes.json()
                ]);

                setAlbum(albumData);
                setAverage(avgData);

                if (currentUser) {
                    const mine = reviewsData.find(r => r.user.username === currentUser.username);
                    setMyReview(mine || null);
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

    if (loading) return (
        <div className="ap-shell">
            <nav className="ap-navbar">
                <span className="ap-navbar-logo" onClick={() => navigate('/user-home')}>CRATE</span>
            </nav>
            <div className="ap-loading">Cargando…</div>
            <UserSlideMenu />
        </div>
    );

    if (!album) return (
        <div className="ap-shell">
            <nav className="ap-navbar">
                <span className="ap-navbar-logo" onClick={() => navigate('/user-home')}>CRATE</span>
            </nav>
            <div className="ap-loading">Álbum no encontrado</div>
            <UserSlideMenu />
        </div>
    );

    const reviewCount = reviews.length + (myReview ? 1 : 0);

    return (
        <div className="ap-shell">
            <nav className="ap-navbar">
                <span className="ap-navbar-logo" onClick={() => navigate('/user-home')}>
                    CRATE
                </span>
                <div className="ap-navbar-search">
                    <SearchBar />
                </div>
            </nav>

            <div className="ap-page">
                <button className="ap-back-btn" onClick={() => navigate(-1)}>
                    ← Volver
                </button>

                <AlbumHeader
                    album={album}
                    average={average}
                    reviewCount={reviewCount}
                    currentUser={currentUser}
                    onAddToList={() => setShowModal(true)}
                />

                {showModal && (
                    <AddToListModal
                        spotifyAlbumId={spotifyAlbumId}
                        currentUser={currentUser}
                        onClose={() => setShowModal(false)}
                        onSuccess={() => { setShowModal(false); setActiveTab('lists'); }}
                    />
                )}

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

            <UserSlideMenu />
        </div>
    );
};

export default AlbumPage;
