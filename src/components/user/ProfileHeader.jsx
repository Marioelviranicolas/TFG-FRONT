import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function ProfileHeader({ user, isOwnProfile }) {
  const navigate = useNavigate();

  const getAvatarUrl = () => {
    if (user.avatarUrl) {
      return user.avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${user.username}&size=200&background=FF6B35&color=fff`;
  };

  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Avatar */}
        <div>
          <img 
            src={getAvatarUrl()} 
            alt={user.username}
            style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${user.username}&size=200&background=FF6B35&color=fff`;
            }}
          />
        </div>

        {/* Información del usuario */}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333'
          }}>
            {user.username}
          </h1>
          
          {user.bio && (
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '10px',
              lineHeight: '1.5'
            }}>
              {user.bio}
            </p>
          )}

          <p style={{
            fontSize: '0.9rem',
            color: '#999',
            marginBottom: '15px'
          }}>
            {user.email}
          </p>
          <div>
          {isOwnProfile && (
            <button 
              onClick={() => navigate('/edit-profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E55A25'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6B35'}
            >
              Editar perfil
            </button>

          )}
          <button 
              onClick={() => navigate('/user-home')}
              style={{
                display: 'flex',
                marginTop: '20px',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#000000',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
            >
              Home
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}