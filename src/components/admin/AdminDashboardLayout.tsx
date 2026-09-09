import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import AdminSidebar from './AdminSidebar';
import DashboardHeader from '../dashboard/DashboardHeader'; // We can reuse the header for now

export default function AdminDashboardLayout() {
  const { profile, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-dashboard-bg)]">
        <LoadingSpinner className="w-8 h-8 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  // Protect route
  if (!profile || profile.role !== 'admin') {
    // Redirect non-admins away
    return <Navigate to="/dashboard" replace />;
  }

  // Get dynamic title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Admin Console';
    if (path.startsWith('/admin/jobs')) return 'Job Lifecycle';
    if (path.startsWith('/admin/chat')) return 'Messages';
    return 'Admin Panel';
  };

  return (
    <div 
      className="flex h-screen bg-[var(--color-dashboard-bg)] overflow-hidden"
      style={{ 
        '--font-body': 'var(--font-jakarta)', 
        '--font-heading': 'var(--font-jakarta)' 
      } as React.CSSProperties}
    >
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={getPageTitle()}
        />
        
        <main className="flex-1 overflow-y-auto bg-[var(--color-dashboard-bg)] p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
