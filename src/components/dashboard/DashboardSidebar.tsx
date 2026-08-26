import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiVideo, 
  FiFolder, 
  FiUploadCloud, 
  FiClock, 
  FiCheckCircle, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiX,
  FiMessageSquare,
  FiEdit3,
  FiShield,
  FiPlayCircle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpload?: () => void;
}

export default function DashboardSidebar({ isOpen, onClose, onOpenUpload }: SidebarProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => `
    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
    ${isActive 
      ? profile?.role === 'kid' ? 'bg-[#FF5E00] text-white shadow-md' :
        profile?.role === 'doctor' ? 'bg-teal-600 text-white shadow-md' :
        'bg-brand-red text-white shadow-md' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
  `;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F7F9FC] border-r border-slate-200 w-64 pt-6 pb-4 px-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="font-heading font-bold text-xl tracking-wide text-slate-900 flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm
            ${profile?.role === 'kid' ? 'bg-[#FFD500]' : 
              profile?.role === 'doctor' ? 'bg-gradient-to-br from-teal-500 to-cyan-500' : 
              'bg-gradient-to-br from-brand-red to-[#F02865]'}`}
          >
            <span className="text-white text-lg font-bold">s</span>
          </div>
          Studio
        </div>
        <button 
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-slate-700"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Workspace</p>
          <nav className="space-y-1">
            <NavLink to="/dashboard" end className={navItemClass}>
              <FiHome className="text-lg" /> Overview
            </NavLink>
            <NavLink to="/dashboard/review" className={navItemClass}>
              <FiPlayCircle className="text-lg" /> Review Edits
            </NavLink>
            <NavLink to="/dashboard/media" className={navItemClass}>
              <FiFolder className="text-lg" /> Media Library
            </NavLink>
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Tools</p>
          <nav className="space-y-1">
            <NavLink to="/dashboard/script-assistant" className={navItemClass}>
              <FiMessageSquare className="text-lg" /> AI Script Bot
            </NavLink>
          </nav>
        </div>

        {profile?.role === 'admin' && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Administration</p>
            <nav className="space-y-1">
              <NavLink to="/admin" className={navItemClass}>
                <FiShield className="text-lg" /> Admin Panel
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200">
        <nav className="space-y-1">
          <NavLink to="/dashboard/settings" className={navItemClass}>
            <FiSettings className="text-lg" /> Settings
          </NavLink>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all text-left"
          >
            <FiLogOut className="text-lg" /> Log out
          </button>
        </nav>
        
        {profile && (
          <Link to="/dashboard/profile" className="mt-6 flex items-center gap-3 px-2 cursor-pointer hover:bg-slate-100 p-2 rounded-xl transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
              <FiUser className="text-slate-400 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {profile.full_name}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {profile.role}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
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
