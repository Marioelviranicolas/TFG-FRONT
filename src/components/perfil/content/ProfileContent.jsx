// src/components/perfil/content/ProfileContent.jsx
import { useState } from 'react';
import ProfileStats from './ProfileStats';
import ProfileReviews from './ProfileReviews';
import ProfileList from './ProfileList';
import FollowModal from './FollowModal';

export default function ProfileContent({ username }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const [modalType, setModalType] = useState(null); // 'followers' | 'following' | null

  return (
    <div>
      <ProfileStats
        username={username}
        onOpenModal={(type) => setModalType(type)}
      />

      <div className="pp-tabs">
        <button
          className={`pp-tab ${activeTab === 'reviews' ? 'pp-tab--active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={`pp-tab ${activeTab === 'lists' ? 'pp-tab--active' : ''}`}
          onClick={() => setActiveTab('lists')}
        >
          Listas
        </button>
        <button
          className={`pp-tab ${activeTab === 'activity' ? 'pp-tab--active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Actividad
        </button>
      </div>

      {activeTab === 'reviews'  && <ProfileReviews username={username} />}
      {activeTab === 'lists'    && <ProfileList username={username} />}
      {activeTab === 'activity' && (
        <p className="pp-activity-soon">Próximamente: feed de actividad reciente.</p>
      )}

      {modalType && (
        <FollowModal
          username={username}
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}