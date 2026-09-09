import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import JobChatBox from '../../components/dashboard/JobChatBox';
import { FiFileText, FiSearch, FiMessageSquare } from 'react-icons/fi';
import type { Database } from '../../types/database.types';
import { fetchUnreadCounts } from '../../lib/api';

type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'] & {
  media_assets_studio: { file_name: string } | null;
};

export default function UserChat() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastMessages, setLastMessages] = useState<Record<string, { content: string, created_at: string }>>({});
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      if (!profile) return;
      const { data, error } = await supabase
        .from('production_jobs_studio')
        .select('*, media_assets_studio(file_name)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const fetchedJobs = data as unknown as ProductionJob[];
        setJobs(fetchedJobs);
        
        // Fetch last message for each job
        const lastMsgs: Record<string, any> = {};
        await Promise.all(fetchedJobs.map(async (job) => {
          const { data: msg } = await supabase
            .from('messages_studio')
            .select('content, created_at')
            .eq('job_id', job.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          if (msg) lastMsgs[job.id] = msg;
        }));
        setLastMessages(lastMsgs);
        
        // Fetch unread messages via backend
        try {
          const counts = await fetchUnreadCounts(profile.id);
          setUnreadCounts(counts);
        } catch (err) {
          console.error("Unread query error:", err);
        }
      }
      setLoading(false);
    }

    fetchJobs();
    
    // Connect to Socket.io for instant unread count updates
    const socket = io('http://localhost:3000');
    
    const updateLastMessage = async (jobId: string) => {
      const { data: msg, error } = await supabase
        .from('messages_studio')
        .select('content, created_at')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle to avoid errors when empty
        
      if (msg) {
        setLastMessages(prev => ({ ...prev, [jobId]: msg }));
      } else if (!error || error.code === 'PGRST116') {
        // If no message found, remove it from lastMessages (e.g. chat deleted)
        setLastMessages(prev => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      }
    };

    socket.on('unreadUpdate', (data: any) => {
      if (!profile) return;
      
      if (data.senderId !== profile.id) {
        fetchUnreadCounts(profile.id)
          .then(counts => setUnreadCounts(counts))
          .catch(err => console.error(err));
      }
      
      if (data.jobId) updateLastMessage(data.jobId);
    });

    socket.on('messageDeleted', (data: { messageId: string, jobId: string }) => {
      if (data.jobId) updateLastMessage(data.jobId);
    });

    socket.on('chatDeleted', (data: { jobId: string }) => {
      if (data.jobId) updateLastMessage(data.jobId);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="w-8 h-8 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const sortedJobs = [...jobs].sort((a, b) => {
    const timeA = lastMessages[a.id]?.created_at || a.created_at;
    const timeB = lastMessages[b.id]?.created_at || b.created_at;
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Jobs List (Left Sidebar) */}
        <div className="w-full md:w-80 lg:w-[350px] border-r border-slate-200 flex flex-col flex-shrink-0 bg-white">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
              Inbox
            </h2>
          </div>
          <div className="px-4 py-2 border-b border-slate-100 pb-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {sortedJobs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No tasks found. Submit a video to get started!</p>
            ) : (
              sortedJobs.map(job => {
                const unread = unreadCounts[job.id] || 0;
                const lastMessage = lastMessages[job.id];
                
                let timeString = '';
                if (lastMessage) {
                  const date = new Date(lastMessage.created_at);
                  const isToday = new Date().toDateString() === date.toDateString();
                  timeString = isToday 
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }
                
                return (
                  <button
                    key={job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setUnreadCounts(prev => ({ ...prev, [job.id]: 0 }));
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${
                      selectedJobId === job.id
                        ? 'bg-slate-50 border-l-4 border-brand-primary'
                        : 'bg-white hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                      selectedJobId === job.id ? 'bg-brand-primary text-white' : 'bg-[#EEF2F6] text-slate-600'
                    }`}>
                      <FiFileText className="text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`font-semibold text-sm truncate ${unread > 0 && selectedJobId !== job.id ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                          {job.media_assets_studio?.file_name || 'Untitled Job'}
                        </span>
                        {timeString && (
                          <span className={`text-[10px] whitespace-nowrap ${unread > 0 ? 'text-brand-primary font-bold' : 'text-slate-400'}`}>
                            {timeString}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-xs truncate max-w-[180px] ${unread > 0 && selectedJobId !== job.id ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                          {lastMessage ? lastMessage.content : 'No messages yet'}
                        </span>
                        {unread > 0 && selectedJobId !== job.id && (
                          <div className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          {selectedJob && profile ? (
            <>
              {/* Right Panel Header */}
              <div className="shrink-0 p-4 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg">
                    <FiFileText />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {selectedJob.media_assets_studio?.file_name || 'Job Chat'}
                    </h2>
                    <p className="text-xs text-slate-500 truncate max-w-sm">
                      Admin Discussion
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
                     <FiSearch className="text-xl" />
                   </button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 flex flex-col bg-white">
                <JobChatBox jobId={selectedJob.id} currentUserId={profile.id} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300 border border-slate-100">
                <FiMessageSquare className="text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Select a Task</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Click on one of your submitted jobs on the left to message the admin team about it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
