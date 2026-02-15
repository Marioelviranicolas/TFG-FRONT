import { useState, useEffect } from 'react';

export default function ProfileStats({ username }) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalLists: 0,
    totalLikes: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [username]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const reviewsResponse = await fetch(
        `http://localhost:9001/reviews/user/${username}`
      );
      const reviews = await reviewsResponse.json();
      
      
      const listsResponse = await fetch(
        `http://localhost:9001/soundlist/user/${username}`
      );
      const lists = await listsResponse.json();
      
      const likesResponse = await fetch(
        `http://localhost:9001/likes/user/${username}`
      );
      const likes = await likesResponse.json();
      
      let avgRating = 0;
      if (reviews && reviews.length > 0) {
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        avgRating = (sum / reviews.length).toFixed(1);
      }
      
      setStats({
        totalReviews: reviews ? reviews.length : 0,
        totalLists: lists ? lists.length : 0,
        totalLikes: likes ? likes.length : 0,
        averageRating: avgRating
      });
      
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando estadísticas..</div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: '30px', 
      padding: '20px', 
      borderTop: '1px solid #ddd',
      borderBottom: '1px solid #ddd',
      margin: '20px 0'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF6B35' }}>
          {stats.totalReviews}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Reviews
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF6B35' }}>
          {stats.totalLists}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Listas
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF6B35' }}>
          {stats.totalLikes}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Likes
        </div>
      </div>
    </div>
  );
}