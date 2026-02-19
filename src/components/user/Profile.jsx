import { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileContent from './ProfileContent';
import { useParams } from "react-router-dom";
import { apiFetch } from '../../api';

export default function Profile() {
  const [user, setUser] = useState(null);           
  const [loading, setLoading] = useState(true);     
  const [error, setError] = useState(null);        
  const [isOwnProfile, setIsOwnProfile] = useState(false); 
  const { username } = useParams();


  useEffect(() => {
    loadUserProfile();
  }, [username]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const response = await apiFetch(`/user/username/${username}`);
      
      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      setIsOwnProfile(currentUser.username === username);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setUser({ ...user, ...updatedData });
  };

  if (loading) {
    return (
      <div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h2>Usuario no encontrado</h2>
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader 
        user={user} 
        isOwnProfile={isOwnProfile}
        onUpdate={handleProfileUpdate}
      />
      
      <ProfileStats username={username} />
      
      <ProfileContent username={username} />
    </div>
  );
}