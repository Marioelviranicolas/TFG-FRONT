// src/perfil/content/ProfileStats.jsx
import { useState, useEffect } from 'react';
import { apiFetch } from '../../../api';

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

      const [reviewsRes, listsRes, likesRes] = await Promise.all([
        apiFetch(`/reviews/user/${username}`),
        apiFetch(`/soundlist/user/${username}`),
        apiFetch(`/likes/user/${username}`)
      ]);

      const [reviews, lists, likes] = await Promise.all([
        reviewsRes.json(),
        listsRes.json(),
        likesRes.json()
      ]);

      let avgRating = 0;
      if (reviews && reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        avgRating = (sum / reviews.length).toFixed(1);
      }

      setStats({
        totalReviews: reviews?.length || 0,
        totalLists: lists?.length || 0,
        totalLikes: likes?.length || 0,
        averageRating: avgRating
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="pp-stats">
      <div className="pp-stat">
        <span className="pp-stat-number">{stats.totalReviews}</span>
        <span className="pp-stat-label">Reviews</span>
      </div>
      <div className="pp-stat">
        <span className="pp-stat-number">{stats.totalLists}</span>
        <span className="pp-stat-label">Listas</span>
      </div>
      <div className="pp-stat">
        <span className="pp-stat-number">{stats.totalLikes}</span>
        <span className="pp-stat-label">Likes</span>
      </div>
      <div className="pp-stat">
        <span className="pp-stat-number">{stats.averageRating}</span>
        <span className="pp-stat-label">Media</span>
      </div>
    </div>
  );
}