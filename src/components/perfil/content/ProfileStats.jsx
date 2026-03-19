// src/components/perfil/content/ProfileStats.jsx
import { useState, useEffect } from 'react';
import { apiFetch } from '../../../api';

export default function ProfileStats({ username, onOpenModal }) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalLists: 0,
    averageRating: 0,
    totalFollowers: 0,
    totalFollowing: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [username]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [reviewsRes, listsRes, followersRes, followingRes] = await Promise.all([
        apiFetch(`/reviews/user/${username}`),
        apiFetch(`/soundlist/user/${username}`),
        apiFetch(`/follow/followers/${username}`),
        apiFetch(`/follow/following/${username}`)
      ]);

      const [reviews, lists, followers, following] = await Promise.all([
        reviewsRes.json(),
        listsRes.json(),
        followersRes.json(),
        followingRes.json()
      ]);

      let avgRating = 0;
      if (reviews && reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        avgRating = (sum / reviews.length).toFixed(1);
      }

      setStats({
        totalReviews:   reviews?.length   || 0,
        totalLists:     lists?.length     || 0,
        averageRating:  avgRating,
        totalFollowers: followers?.length || 0,
        totalFollowing: following?.length || 0
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
        <span className="pp-stat-number">{stats.averageRating}</span>
        <span className="pp-stat-label">Media</span>
      </div>

      <div
        className="pp-stat pp-stat--clickable"
        onClick={() => onOpenModal('followers')}
      >
        <span className="pp-stat-number">{stats.totalFollowers}</span>
        <span className="pp-stat-label">Seguidores</span>
      </div>

      <div
        className="pp-stat pp-stat--clickable"
        onClick={() => onOpenModal('following')}
      >
        <span className="pp-stat-number">{stats.totalFollowing}</span>
        <span className="pp-stat-label">Siguiendo</span>
      </div>
    </div>
  );
}