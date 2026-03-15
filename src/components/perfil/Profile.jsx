// src/perfil/Profile.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../api';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './content/ProfileContent';
import './profile.css';

export default function Profile({ username: propUsername }) {
  const { username: paramUsername } = useParams();
  const username = propUsername || paramUsername;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [username]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/user/username/${username}`);
      if (!response.ok) throw new Error('Usuario no encontrado');
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

  if (loading) return <div className="pp-page"><p className="pp-loading">Cargando perfil…</p></div>;
  if (error)   return <div className="pp-page"><p className="pp-error">{error}</p></div>;
  if (!user)   return <div className="pp-page"><p className="pp-error">Usuario no encontrado</p></div>;

  return (
    <div className="pp-page">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
      <ProfileContent username={username} />
    </div>
  );
}