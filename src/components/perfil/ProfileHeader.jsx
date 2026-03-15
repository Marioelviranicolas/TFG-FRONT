// src/perfil/ProfileHeader.jsx
import { useNavigate } from 'react-router-dom';

export default function ProfileHeader({ user, isOwnProfile }) {
  const navigate = useNavigate();

  const getAvatarUrl = () => {
    if (user.avatarUrl) return user.avatarUrl;
    return `https://ui-avatars.com/api/?name=${user.username}&size=200&background=ff5500&color=fff`;
  };

  return (
    <div className="pp-header">
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

      <div className="pp-info">
        <h1 className="pp-username">{user.username}</h1>

        {user.bio && (
          <p className="pp-bio">{user.bio}</p>
        )}

        <p className="pp-email">{user.email}</p>

        <div className="pp-header-actions">
          {isOwnProfile && (
            <button
              className="pp-btn-edit"
              onClick={() => navigate('/edit-profile')}
            >
              Editar perfil
            </button>
          )}
          <button
            className="pp-btn-home"
            onClick={() => navigate('/user-home')}
          >
            ← Home
          </button>
        </div>
      </div>
    </div>
  );
}