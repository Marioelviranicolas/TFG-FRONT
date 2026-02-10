import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/public/Landing';
import UserHome from './components/user/UserHome';

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path="/user-home" element={<UserHome />} />
    </Routes>
  </BrowserRouter>
  );
}
export default App
