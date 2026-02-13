import { useState, useEffect } from 'react';

export default function ProfileContent({ username }) {
  // Estado de los tabs
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'reviews') {
      loadReviews();
    } else if (activeTab === 'lists') {
      loadLists();
    }
  }, [activeTab, username]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:9001/reviews/user/${username}`
      );
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLists = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:9001/soundlist/user/${username}`
      );
      const data = await response.json();
      setLists(data || []);
    } catch (error) {
      console.error('Error loading lists:', error);
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);       
    const hasHalfStar = rating % 1 !== 0;       
    
    return (
      <span>
        {'★'.repeat(fullStars)}               
        {hasHalfStar && '½'}                  
        {'☆'.repeat(5 - Math.ceil(rating))}   
      </span>
    );
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        borderBottom: '2px solid #ddd',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'reviews' ? '3px solid #FF6B35' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'reviews' ? 'bold' : 'normal',
            color: activeTab === 'reviews' ? '#FF6B35' : '#666'
          }}
        >
          Reviews
        </button>

        <button
          onClick={() => setActiveTab('lists')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'lists' ? '3px solid #FF6B35' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'lists' ? 'bold' : 'normal',
            color: activeTab === 'lists' ? '#FF6B35' : '#666'
          }}
        >
          Listas
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'activity' ? '3px solid #FF6B35' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'activity' ? 'bold' : 'normal',
            color: activeTab === 'activity' ? '#FF6B35' : '#666'
          }}
        >
          Actividad
        </button>
      </div>

      <div>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <p>No hay reviews todavía</p>
                ) : (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {reviews.map((review) => (
                      <div 
                        key={review.idReviews}
                        style={{
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          padding: '15px'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '15px' }}>
                          {review.album && review.album.coverUrl && (
                            <img 
                              src={review.album.coverUrl}
                              alt={review.album.title}
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '4px',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                          
                          <div style={{ flex: 1 }}>
                            {review.album && (
                              <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>
                                  {review.album.title}
                                </h3>
                                <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                                  {review.album.artist}
                                </p>
                              </div>
                            )}
                            
                            <div style={{ 
                              color: '#FF6B35', 
                              fontSize: '1.2rem',
                              marginBottom: '10px'
                            }}>
                              {renderStars(review.rating)}
                              <span style={{ 
                                marginLeft: '10px', 
                                fontSize: '0.9rem',
                                color: '#666'
                              }}>
                                {review.rating}/5
                              </span>
                            </div>
                            
                            {review.comment && (
                              <p style={{ margin: '10px 0 0 0', color: '#333' }}>
                                {review.comment}
                              </p>
                            )}
                            
                            <small style={{ color: '#999' }}>
                              {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lists' && (
              <div>
                {lists.length === 0 ? (
                  <p>No hay listas todavía</p>
                ) : (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {lists.map((list) => (
                      <div 
                        key={list.idSoundLists}
                        style={{
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          padding: '15px',
                          cursor: 'pointer'
                        }}
                      >
                        <h3 style={{ margin: '0 0 10px 0' }}>
                          📝 {list.name}
                        </h3>
                        
                        {list.description && (
                          <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                            {list.description}
                          </p>
                        )}
                        
                        <small style={{ color: '#999' }}>
                          Creada el {new Date(list.createdAt).toLocaleDateString('es-ES')}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <p>Próximamente: feed de actividad reciente</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}