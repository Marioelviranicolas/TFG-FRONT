import { useState } from 'react';
import EditProfileModal from './EditProfileModal';

export default function ProfileHeader({ user, isOwnProfile, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const getAvatarUrl = () => {
    if (user.avatarUrl) {
      return user.avatarUrl; // Avatar personalizado x url o x claudinaryy
    }
    // Si no tiene avatar, genera uno con sus iniciales
    return `https://ui-avatars.com/api/?name=${user.username}&size=200&background=FF6B35&color=fff`;
  };

  return (
    <div>
      <div>
        <div>
          <img 
            src={getAvatarUrl()} 
            alt={user.username}
            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
          />
        </div>

        <div>
          <h1>{user.username}</h1>
          
          {user.bio && (
            <p>{user.bio}</p>
          )}

          <p>
            <small>{user.email}</small>
          </p>

          {isOwnProfile && (
            <div>
              <button onClick={() => setShowEditModal(true)}>
                 Editar perfil
              </button>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}