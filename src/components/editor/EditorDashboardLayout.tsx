import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import DashboardHeader from '../dashboard/DashboardHeader';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiFolder, FiMessageSquare, FiLogOut, FiX, FiShield } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';

function EditorSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => `
    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
    ${isActive 
      ? 'bg-slate-900 text-white shadow-md' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
  `;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F7F9FC] border-r border-slate-200 w-64 pt-6 pb-4 px-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="font-heading font-bold text-xl tracking-wide text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center shadow-sm">
            <span className="text-white text-lg font-bold font-heading">E</span>
          </div>
          Editor Studio
        </div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-700">
          <FiX className="text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Workspace</p>
          <nav className="space-y-1">
            <NavLink to="/editor" end className={navItemClass}>
              <FiFolder className="text-lg" /> Assigned Jobs
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200">
        <nav className="space-y-1">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all text-left"
          >
            <FiLogOut className="text-lg" /> Log out
          </button>
        </nav>
        
        {profile && (
          <div className="mt-6 flex items-center gap-3 px-2 p-2 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
              <FiShield className="text-slate-400 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {profile.full_name || 'Editor'}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {profile.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block h-screen sticky top-0">{sidebarContent}</div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function EditorDashboardLayout() {
  const { profile, loading } = useAuth();
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
  if (!profile || profile.role !== 'editor') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div 
      className="flex h-screen bg-white overflow-hidden"
      style={{ '--font-body': 'var(--font-jakarta)', '--font-heading': 'var(--font-jakarta)' } as React.CSSProperties}
    >
      <EditorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="Editor Dashboard"
        />
        
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
