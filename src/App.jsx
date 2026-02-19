import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/public/Landing';
import UserHome from './components/user/UserHome';
import Profile from './components/user/Profile';
import EditProfile from './components/user/EditProfile'
import ExploreUsers from './components/user/ExploreUsers'
import AlbumPage from './components/user/AlbumPage';
import ListDetail from './components/user/ListDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path='/profile' element={<ProfileWrapper />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/explore-users' element={<ExploreUsers/>} />
        <Route path='/album/:spotifyAlbumId' element={<AlbumPage />} />
        <Route path='/list/:id' element={<ListDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
// Componente auxiliar para obtener el username del localStorage no borrar
function ProfileWrapper() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <Profile username={currentUser.username} />;
}
export default App
