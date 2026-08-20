import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import KidsZone from './pages/KidsZone';
import HealthcarePage from './pages/HealthcarePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './components/Contact';
import { ProtectedRoute } from './components/ProtectedRoute';
import CreatorDashboardLayout from './components/dashboard/CreatorDashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Projects from './pages/dashboard/Projects';
import SubmitProduction from './pages/dashboard/SubmitProduction';
import MediaLibrary from './pages/dashboard/MediaLibrary';
import ReviewFeedback from './pages/dashboard/ReviewFeedback';
import CompletedContent from './pages/dashboard/CompletedContent';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const hideHeaderFooter = isAuthPage || isDashboardPage;

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

        {/* PROTECTED CREATOR DASHBOARD */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['creator']}>
              <CreatorDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="projects" element={<Projects />} />
          <Route path="submit" element={<SubmitProduction />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="review" element={<ReviewFeedback />} />
          <Route path="completed" element={<CompletedContent />} />
        </Route>
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;

