import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/public/Landing';
import UserHome from './components/user/UserHome';
import ExploreUsers from './components/user/ExploreUsers';
import AlbumPage from './components/album/AlbumPage';
import ListDetail from './components/perfil/content/ListDetail';
import Profile from './components/perfil/Profile';
import EditProfile from './components/perfil/edit/EditProfile';
import AboutUs from './components/layout/public/AboutUs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path='/profile' element={<ProfileWrapper />} />
        <Route path="/profile/:username" element={<Profile />} />
         <Route path="/about" element={<AboutUs />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/explore-users' element={<ExploreUsers />} />
        <Route path='/album/:spotifyAlbumId' element={<AlbumPage />} />
        <Route path='/list/:id' element={<ListDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProfileWrapper() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) return <Navigate to="/" replace />;
  return <Profile username={currentUser.username} />;
}

export default App;