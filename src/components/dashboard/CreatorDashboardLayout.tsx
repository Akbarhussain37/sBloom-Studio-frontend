import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
export default function CreatorDashboardLayout() {
  const { user, profile, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <LoadingSpinner className="w-8 h-8 border-brand-red border-t-transparent" />
      </div>
    );
  }

  // Protect route
  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get dynamic title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path.startsWith('/dashboard/media')) return 'Media Library';
    if (path.startsWith('/dashboard/projects')) return 'Projects';
    if (path.startsWith('/dashboard/videos')) return 'Video Details';
    if (path.startsWith('/dashboard/submissions')) return 'Submission History';
    if (path.startsWith('/dashboard/submit')) return 'Submit Content';
    if (path.startsWith('/dashboard/review')) return 'Review & Feedback';
    if (path.startsWith('/dashboard/completed')) return 'Completed Content';
    if (path.startsWith('/dashboard/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-body">
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={getPageTitle()}
        />
        
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
