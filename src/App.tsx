import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import KidsZone from './pages/KidsZone';
import HealthcarePage from './pages/HealthcarePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './components/Contact';
import CreatorDashboardLayout from './components/dashboard/CreatorDashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MediaLibrary from './pages/dashboard/MediaLibrary';
import Projects from './pages/dashboard/Projects';
import ReviewFeedback from './pages/dashboard/ReviewFeedback';
import CompletedContent from './pages/dashboard/CompletedContent';
import VideoDetails from './pages/dashboard/VideoDetails';
import ScriptAssistant from './pages/dashboard/ScriptAssistant';
import UploadJob from './pages/dashboard/UploadJob';
import UserJobLifecycle from './pages/dashboard/UserJobLifecycle';
import UserChat from './pages/dashboard/UserChat';
import AdminDashboardLayout from './components/admin/AdminDashboardLayout';
import AdminJobLifecycle from './pages/admin/AdminJobLifecycle';
import AdminChat from './pages/admin/AdminChat';
import AdminUsers from './pages/admin/AdminUsers';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import EditorDashboardLayout from './components/editor/EditorDashboardLayout';
import EditorDashboard from './pages/editor/EditorDashboard';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isEditorPage = location.pathname.startsWith('/editor');
  const hideHeaderFooter = isAuthPage || isDashboardPage || isAdminPage || isEditorPage;

  return (
    <div className="bg-white min-h-screen font-body text-gray-900 selection:bg-brand-primary selection:text-white">
      {!hideHeaderFooter && <Header />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/kids-zone" element={<KidsZone />} />
        <Route path="/healthcare" element={<HealthcarePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<CreatorDashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="videos/:videoId" element={<VideoDetails />} />
          <Route path="projects" element={<Projects />} />
          <Route path="review" element={<ReviewFeedback />} />
          <Route path="completed" element={<CompletedContent />} />
          <Route path="script-assistant" element={<ScriptAssistant />} />
          <Route path="jobs" element={<UserJobLifecycle />} />
          <Route path="chat" element={<UserChat />} />
          <Route path="upload-job" element={<UploadJob />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminJobLifecycle />} />
          <Route path="jobs" element={<AdminJobLifecycle />} />
          <Route path="chat" element={<AdminChat />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Editor Routes */}
        <Route path="/editor" element={<EditorDashboardLayout />}>
          <Route index element={<EditorDashboard />} />
        </Route>
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;

