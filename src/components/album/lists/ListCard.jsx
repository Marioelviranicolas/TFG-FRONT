// src/components/album/lists/ListCard.jsx

const ListCard = ({ item, isOwn, currentUser, onCopy, copying }) => {
    if (isOwn) return (
        <div className="ap-list-card ap-list-card--mine">
            <div className="ap-list-card-top">
                <span className="ap-list-name">
                    <span className="ap-list-icon">◈</span>
                    {item.listName}
                    <span className="ap-you-badge">tú</span>
                </span>
            </div>
            <span className="ap-date">
                Añadido el {new Date(item.addedAt).toLocaleDateString('es-ES')}
            </span>
        </div>
    );

    return (
        <div className="ap-list-card">
            <div className="ap-list-card-top">
                <span className="ap-list-name">
                    <span className="ap-list-icon">◈</span>
                    {item.listName}
                </span>
                {currentUser && (
                    <button
                        className="ap-btn-copy"
                        onClick={() => onCopy(item)}
                        disabled={copying === item.idListAlbum}
                    >
                        {copying === item.idListAlbum ? 'Copiando…' : 'Copiar lista'}
                    </button>
                )}
            </div>
            <span className="ap-date">Por {item.listOwnerUsername}</span>
            <span className="ap-date">
                Añadido el {new Date(item.addedAt).toLocaleDateString('es-ES')}
            </span>
        </div>
    );
};

export default ListCard;
