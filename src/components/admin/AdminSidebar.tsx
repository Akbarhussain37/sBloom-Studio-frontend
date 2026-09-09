import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFolder, 
  FiUser, 
  FiLogOut,
  FiX,
  FiMessageSquare,
  FiShield,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => `
    flex items-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap overflow-hidden
    ${isActive 
      ? 'bg-[var(--color-sidebar-active)] text-white shadow-md shadow-violet-500/20' 
      : 'text-slate-400 hover:bg-[#1C1A3A] hover:text-white'}
    ${isExpanded ? 'px-4 w-full' : 'px-0 w-12 justify-center mx-auto'}
  `;

  const sidebarContent = (
    <div 
      className={`flex flex-col h-full bg-[var(--color-sidebar-bg)] border-r border-[#1C1A3A] pt-6 pb-4 flex-shrink-0 text-slate-300 transition-[width] duration-300 z-50 relative ${isExpanded ? 'w-64 px-4' : 'w-20 px-2 items-center'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={() => setIsPinned(!isPinned)}
        className="hidden md:flex absolute top-8 -right-3.5 z-[60] items-center justify-center w-7 h-7 rounded-full bg-[#1C1A3A] border border-slate-700 text-slate-400 hover:text-white transition-colors shadow-md cursor-pointer"
      >
        {isPinned ? <FiChevronLeft className="text-sm" /> : <FiChevronRight className="text-sm" />}
      </button>

      <div className={`flex items-center justify-between mb-8 ${isExpanded ? 'px-2' : 'justify-center w-full'} relative`}>
        {isExpanded ? (
          <div className="font-heading font-bold text-xl tracking-wide text-white flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-sidebar-active)] flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white text-lg font-bold font-heading">A</span>
            </div>
            Admin Panel
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[var(--color-sidebar-active)] flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-lg font-bold font-heading">A</span>
          </div>
        )}
        <button 
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-slate-700 absolute right-0 top-0"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 space-y-6 w-full">
        <div>
          {isExpanded ? (
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2 whitespace-nowrap">Workspace</p>
          ) : (
            <div className="h-4 mb-3 border-b border-[#1C1A3A] mx-4"></div>
          )}
          <nav className="space-y-2 flex flex-col items-center w-full">
            <NavLink to="/admin/jobs" className={navItemClass}>
              <FiFolder className="text-lg shrink-0" /> 
              {isExpanded && <span>Job Lifecycle</span>}
            </NavLink>
            <NavLink to="/admin/chat" className={navItemClass}>
              <FiMessageSquare className="text-lg shrink-0" /> 
              {isExpanded && <span>Messages</span>}
            </NavLink>
            <NavLink to="/admin/users" className={navItemClass}>
              <FiUser className="text-lg shrink-0" /> 
              {isExpanded && <span>Users</span>}
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-[#1C1A3A] w-full flex flex-col items-center">
        <nav className="space-y-2 w-full flex flex-col items-center">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all overflow-hidden whitespace-nowrap text-slate-400 hover:bg-[#1C1A3A] hover:text-white ${isExpanded ? 'px-4 w-full text-left' : 'px-0 w-12 justify-center mx-auto'}`}
          >
            <FiLogOut className="text-lg shrink-0" /> 
            {isExpanded && <span>Log out</span>}
          </button>
        </nav>
        
        {profile && (
          <div className={`mt-6 flex items-center gap-3 p-2 rounded-xl overflow-hidden whitespace-nowrap w-full ${!isExpanded && 'justify-center px-0'}`}>
            <div className="w-10 h-10 rounded-full bg-[#1C1A3A] border-2 border-[var(--color-sidebar-bg)] shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <FiShield className="text-slate-400 text-xl" />
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {profile.full_name || 'Admin'}
                </p>
                <p className="text-xs text-slate-400 truncate capitalize">
                  {profile.role}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 z-50 relative">
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
