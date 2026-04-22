// src/components/album/AlbumHeader.jsx

const AlbumHeader = ({ album, average, reviewCount, currentUser, onAddToList }) => (
    <div className="ap-header">
        <img src={album.coverUrl} alt={album.title} className="ap-cover fade-in-section delay-2" />
        <div className="ap-info fade-in-section delay-3">
            <h1 className="ap-info-title">{album.title}</h1>
            <h2 className="ap-info-artist">{album.artist}</h2>

            {average !== null && (
                <div className="ap-average">
                    <span className="ap-average-number">{Number(average).toFixed(1)}</span>
                    <div className="ap-average-meta">
                        <span className="ap-average-denom">/ 5</span>
                        <span className="ap-average-count">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
                    </div>
                </div>
            )}

            {currentUser && (
                <button className="ap-btn-add-list" onClick={onAddToList}>
                    + Añadir a lista
                </button>
            )}
        </div>
    </div>
);

export default AlbumHeader;
