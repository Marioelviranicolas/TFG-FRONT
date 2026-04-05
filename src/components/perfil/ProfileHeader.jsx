// src/components/perfil/ProfileHeader.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import FavoriteAlbums from './FavoriteAlbums';

export default function ProfileHeader({ user, isOwnProfile }) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    if (!isOwnProfile && currentUser.username) {
      checkFollowStatus();
    }
  }, [user.username]);

  const checkFollowStatus = async () => {
    try {
      const res = await apiFetch(`/follow/status/${currentUser.username}/${user.username}`);
      const data = await res.json();
      setIsFollowing(data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    try {
      setLoadingFollow(true);
      if (isFollowing) {
        await apiFetch(`/follow/${user.username}?followerUsername=${currentUser.username}`, { method: 'DELETE' });
        setIsFollowing(false);
      } else {
        await apiFetch(`/follow/${user.username}?followerUsername=${currentUser.username}`, { method: 'POST' });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const getAvatarUrl = () => {
    if (user.avatarUrl) return user.avatarUrl;
    return `https://ui-avatars.com/api/?name=${user.username}&size=200&background=ff5500&color=fff`;
  };

  return (
    <div className="pp-header">
      {/* Avatar */}
      <div className="pp-avatar-wrap">
        <img
          src={getAvatarUrl()}
          alt={user.username}
          className="pp-avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${user.username}&size=200&background=ff5500&color=fff`;
          }}
        />
      </div>

      {/* Info */}
      <div className="pp-info">
        <h1 className="pp-username">{user.username}</h1>

        {user.bio && (
          <p className="pp-bio">{user.bio}</p>
        )}

        <p className="pp-email">{user.email}</p>

        <div className="pp-header-actions">
          {isOwnProfile ? (
            <button className="pp-btn-edit" onClick={() => navigate('/edit-profile')}>
              Editar perfil
            </button>
          ) : (
            <button
              className={isFollowing ? 'pp-btn-home' : 'pp-btn-edit'}
              onClick={handleFollow}
              disabled={loadingFollow}
            >
              {loadingFollow ? '...' : isFollowing ? 'Dejar de seguir' : '+ Seguir'}
            </button>
          )}
          <button className="pp-btn-home" onClick={() => navigate('/user-home')}>
            ← Home
          </button>
        </div>
      </div>

      {/* Favoritos */}
      <FavoriteAlbums username={user.username} isOwnProfile={isOwnProfile} />
    </div>
  );
}
