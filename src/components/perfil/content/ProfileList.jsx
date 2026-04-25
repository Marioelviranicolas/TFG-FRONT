// src/perfil/content/ProfileList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api';
import AddToListModal from '../../album/modal/AddToListModal';

export default function ProfileList({ username }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  const isOwnProfile = currentUser.username === username;

  useEffect(() => {
    loadLists();
  }, [username]);

  const loadLists = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/soundlist/user/${username}`);
      const data = await res.json();
      setLists(data || []);
    } catch (error) {
      console.error('Error loading lists:', error);
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  const parseDate = (date) => {
    if (!date) return '';
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      return new Date(year, month - 1, day).toLocaleDateString('es-ES');
    }
    return new Date(date).toLocaleDateString('es-ES');
  };

  if (loading) return <p className="pp-loading">Cargando listas…</p>;

  return (
    <div>
      <span className="pp-section-title"></span>

      {isOwnProfile && (
        <button
          className="pp-btn-create-list"
          onClick={() => setShowCreateModal(true)}
        >
          Crear lista
        </button>
      )}

      {lists.length === 0 ? (
        <p className="pp-no-content">No hay listas todavía.</p>
      ) : (
        lists.map((list, index) => (
          <div
            key={list.id || index}
            className="pp-list-card"
            onClick={() => navigate(`/list/${list.id}`)}
          >
            <div className="pp-list-card-top">
              <span className="pp-list-name">📝 {list.name}</span>
            </div>
            {list.description && (
              <p className="pp-list-desc">{list.description}</p>
            )}
            <span className="pp-list-date">
              Creada el {parseDate(list.createdAt)}
            </span>
          </div>
        ))
      )}

      {showCreateModal && (
        <AddToListModal
          spotifyAlbumId={null}
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadLists();
          }}
        />
      )}
    </div>
  );
}