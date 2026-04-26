import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/public/Landing';
import UserHome from './components/user/UserHome';
import ExploreUsers from './components/user/ExploreUsers';
import ExploreAlbums from './components/user/ExploreAlbums';
import AlbumPage from './components/album/AlbumPage';
import ListDetail from './components/perfil/content/ListDetail';
import Profile from './components/perfil/Profile';
import EditProfile from './components/perfil/edit/EditProfile';
import AboutUs from './components/layout/public/AboutUs';
import PrivateRoute from './components/layout/PrivateRoute';
import AdminPanel from './components/admin/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path='/'      element={<Landing />} />
        <Route path='/about' element={<AboutUs />} />

        {/* Privadas */}
        <Route path='/user-home'             element={<PrivateRoute><UserHome /></PrivateRoute>} />
        <Route path='/profile'               element={<PrivateRoute><ProfileWrapper /></PrivateRoute>} />
        <Route path='/profile/:username'     element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='/edit-profile'          element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path='/explore-users'         element={<PrivateRoute><ExploreUsers /></PrivateRoute>} />
        <Route path='/explore-albums'        element={<PrivateRoute><ExploreAlbums /></PrivateRoute>} />
        <Route path='/album/:spotifyAlbumId' element={<PrivateRoute><AlbumPage /></PrivateRoute>} />
        <Route path='/list/:id'              element={<PrivateRoute><ListDetail /></PrivateRoute>} />
        <Route path='/admin'                 element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
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
