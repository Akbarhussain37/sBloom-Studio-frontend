import { FiMenu, FiBell, FiSearch, FiUser, FiUploadCloud, FiEdit3 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenUpload?: () => void;
  title?: string;
}

export default function DashboardHeader({ onMenuClick, onOpenUpload, title = 'Dashboard' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          <FiMenu className="text-xl" />
        </button>
        <h1 className="text-xl font-bold font-heading text-slate-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 mr-2">
          <Link 
            to="/dashboard/upload-job"
            className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red/90 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <FiEdit3 className="text-lg" />
            <span>Request Edit</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center relative">
          <FiSearch className="absolute left-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-9 pr-4 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red w-64 transition-all"
          />
        </div>
        
        <button className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative">
          <FiBell className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <Link to="/dashboard/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
             <FiUser className="text-slate-400 text-lg" />
          </div>
        </Link>
      </div>
    </header>
  );
}
