// src/components/album/reviews/StarRating.jsx
import { useState } from 'react';

const StarRating = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(null);
    const display = hovered !== null ? hovered : value;

    const handleMouseMove = (e, star) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHovered(e.clientX - rect.left < rect.width / 2 ? star - 0.5 : star);
    };

    const handleClick = (e, star) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onChange(e.clientX - rect.left < rect.width / 2 ? star - 0.5 : star);
    };

    return (
        <div className="ap-star-selector">
            {[1, 2, 3, 4, 5].map(star => {
                const full = display >= star;
                const half = !full && display >= star - 0.5;
                return (
                    <div
                        key={star}
                        className="ap-star-wrap"
                        onMouseMove={e => handleMouseMove(e, star)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={e => handleClick(e, star)}
                    >
                        <span style={{ position: 'absolute', top: 0, left: 0, fontSize: 36, color: '#252525', userSelect: 'none', lineHeight: 1 }}>★</span>
                        {(full || half) && (
                            <span style={{
                                position: 'absolute', top: 0, left: 0,
                                fontSize: 36, color: '#ff5500', lineHeight: 1,
                                width: full ? '100%' : '50%',
                                overflow: 'hidden', display: 'block',
                                whiteSpace: 'nowrap', userSelect: 'none'
                            }}>★</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;
