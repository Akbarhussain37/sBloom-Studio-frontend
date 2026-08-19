import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import KidsZone from './pages/KidsZone';
import HealthcarePage from './pages/HealthcarePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './components/Contact';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const hideHeaderFooter = isAuthPage;

  return (
    <div className="bg-white min-h-screen font-body text-gray-900 selection:bg-brand-red selection:text-white">
      {!hideHeaderFooter && <Header />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/kids-zone" element={<KidsZone />} />
        <Route path="/healthcare" element={<HealthcarePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;

