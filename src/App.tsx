import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import KidsZone from './pages/KidsZone';

function App() {
  return (
    <div className="bg-white min-h-screen font-body text-gray-900 selection:bg-brand-red selection:text-white">
      <Header />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/kids-zone" element={<KidsZone />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
