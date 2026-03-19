// src/components/perfil/content/FollowModal.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { apiFetch } from '../../../api';

export default function FollowModal({ username, type, onClose }) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, [username, type]);

  const loadList = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/follow/${type}/${username}`);
      const data = await res.json();
      setList(data || []);
    } catch (error) {
      console.error('Error loading follow list:', error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (username) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  const getDisplayUsername = (follow) =>
    type === 'followers' ? follow.followerUsername : follow.followedUsername;

  const getDisplayAvatar = (follow) =>
    type === 'followers' ? follow.followerAvatarUrl : follow.followedAvatarUrl;

  const getFallbackAvatar = (username) =>
    `https://ui-avatars.com/api/?name=${username}&size=80&background=ff5500&color=fff`;

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>

        <div className="ap-modal-header">
          <h3>{type === 'followers' ? 'Seguidores' : 'Siguiendo'}</h3>
          <button className="ap-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <p className="ap-modal-loading">Cargando…</p>
        ) : list.length === 0 ? (
          <p className="ap-modal-empty">
            {type === 'followers'
              ? 'Aún no tiene seguidores'
              : 'No sigue a nadie todavía'
            }
          </p>
        ) : (
          <div className="ap-modal-lists">
            {list.map((follow, index) => {
              const displayUsername = getDisplayUsername(follow);
              const avatarUrl = getDisplayAvatar(follow);
              return (
                <button
                  key={index}
                  className="fm-user-item"
                  onClick={() => handleUserClick(displayUsername)}
                >
                  <img
                    src={avatarUrl || getFallbackAvatar(displayUsername)}
                    alt={displayUsername}
                    className="fm-user-avatar"
                    onError={(e) => {
                      e.target.src = getFallbackAvatar(displayUsername);
                    }}
                  />
                  <span className="fm-user-username">{displayUsername}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}