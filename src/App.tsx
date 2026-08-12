import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import KidsZone from './pages/KidsZone';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Contact from './components/Contact';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname);

  return (
    <div className="bg-white min-h-screen font-body text-gray-900 selection:bg-brand-red selection:text-white">
      {!isAuthPage && <Header />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/kids-zone" element={<KidsZone />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
