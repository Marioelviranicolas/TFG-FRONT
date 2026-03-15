// src/components/album/reviews/RenderStars.jsx

const RenderStars = ({ rating, size = 20 }) => (
    <div style={{ display: 'flex', gap: '3px' }}>
        {[1, 2, 3, 4, 5].map(star => {
            const full = rating >= star;
            const half = !full && rating >= star - 0.5;
            return (
                <div key={star} style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
                    <span style={{ position: 'absolute', top: 0, left: 0, fontSize: size, color: '#2a2a2a', userSelect: 'none', lineHeight: 1 }}>★</span>
                    {(full || half) && (
                        <span style={{
                            position: 'absolute', top: 0, left: 0,
                            fontSize: size, color: '#ff5500', lineHeight: 1,
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

export default RenderStars;