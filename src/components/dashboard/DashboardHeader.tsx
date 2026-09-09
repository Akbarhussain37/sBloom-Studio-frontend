import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiBell, FiSearch, FiUser, FiEdit3, FiMessageSquare } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenUpload?: () => void;
  title?: string;
}

export default function DashboardHeader({ onMenuClick, title = 'Dashboard' }: HeaderProps) {
  const { profile } = useAuth();
  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat');
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;

    const fetchNotifications = async () => {
      try {
        // Fetch count
        const { count, error: countError } = await supabase
          .from('messages_studio')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .neq('sender_id', profile.id);

        if (!countError && count !== null) {
          setUnreadCount(count);
        }

        // Fetch recent notifications
        const { data, error } = await supabase
          .from('messages_studio')
          .select('*')
          .eq('is_read', false)
          .neq('sender_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const messages = (data as any[]) || [];

        if (messages.length > 0) {
          const jobIds = [...new Set(messages.map(m => m.job_id))];
          
          const { data: jobsData } = await supabase
            .from('production_jobs_studio')
            .select('id, media_asset_id, media_assets_studio(file_name)')
            .in('id', jobIds);
            
          const jobs = (jobsData as any[]) || [];
            
          const mappedMessages = messages.map(msg => ({
            ...msg,
            production_jobs_studio: jobs.find(j => j.id === msg.job_id) || null
          }));
          
          setNotifications(mappedMessages);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    
    // Poll for new messages every 5 seconds
    const pollInterval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(pollInterval);
  }, [profile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('media_assets_studio')
          .select('*')
          .ilike('file_name', `%${searchQuery}%`)
          .limit(5);

        if (!error && data) {
          setSearchResults(data);
          setShowSearch(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNotificationClick = () => {
    setShowNotifications(false);
    if (profile?.role === 'admin') {
      navigate('/admin/chat');
    } else {
      navigate('/dashboard/chat');
    }
  };

  const handleSearchResultClick = (assetId: string) => {
    setShowSearch(false);
    setSearchQuery('');
    navigate(`/dashboard/videos/${assetId}`);
  };

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
        {!isChatPage && (
          <div className="hidden md:flex items-center gap-3 mr-2">
            <Link 
              to="/dashboard/upload-job"
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              <FiEdit3 className="text-lg" />
              <span>Request Edit</span>
            </Link>
          </div>
        )}

        {!isChatPage && (
          <div className="hidden md:flex items-center relative" ref={searchRef}>
            <FiSearch className="absolute left-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowSearch(true); }}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary w-64 transition-all"
            />
            
            <AnimatePresence>
              {showSearch && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
                >
                  {searchResults.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleSearchResultClick(asset.id)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <p className="text-sm font-semibold text-slate-900 truncate">{asset.file_name}</p>
                      <p className="text-xs text-slate-500 capitalize">{asset.status.replace(/_/g, ' ')}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative"
          >
            <FiBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-semibold text-brand-primary bg-red-50 px-2 py-1 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      // Handle the Supabase nested response (it can be an array or single object depending on relationship)
                      const job = Array.isArray(notif.production_jobs_studio) ? notif.production_jobs_studio[0] : notif.production_jobs_studio;
                      const mediaAsset = job ? (Array.isArray(job.media_assets_studio) ? job.media_assets_studio[0] : job.media_assets_studio) : null;
                      const fileName = mediaAsset?.file_name || 'Project Update';
                      
                      return (
                        <button 
                          key={notif.id}
                          onClick={handleNotificationClick}
                          className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex gap-3 items-start"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-1">
                            <FiMessageSquare />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 truncate">{fileName}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notif.content}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <FiBell className="text-3xl mx-auto mb-3 text-slate-300" />
                      <p className="text-sm font-medium">No new notifications</p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <button 
                    onClick={handleNotificationClick}
                    className="w-full p-3 text-center text-sm font-bold text-brand-primary hover:bg-red-50 transition-colors border-t border-slate-100"
                  >
                    View All Messages
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
