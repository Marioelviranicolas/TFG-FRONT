import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/public/Landing';
import UserHome from './components/user/UserHome';
import Profile from './components/user/Profile';
import EditProfile from './components/user/EditProfile'
import ExploreUsers from './components/user/ExploreUsers'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path='/profile' element={<ProfileWrapper />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/explore-users' element={<ExploreUsers/>} />
      </Routes>
    </BrowserRouter>
  );
}
// Componente auxiliar para obtener el username del localStorage no borrar
function ProfileWrapper() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <Profile username={currentUser.username} />;
}
export default App
