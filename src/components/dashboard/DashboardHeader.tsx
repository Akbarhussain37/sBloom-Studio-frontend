import { FiMenu, FiUser } from 'react-icons/fi';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function DashboardHeader({ onMenuClick, title = 'Dashboard' }: HeaderProps) {
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
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
             <FiUser className="text-slate-400 text-lg" />
          </div>
        </div>
      </div>
    </header>
  );
}
