import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import JobChatBox from '../../components/dashboard/JobChatBox';
import { FiFileText, FiClock, FiCheck } from 'react-icons/fi';
import type { Database } from '../../types/database.types';
import { fetchUnreadCounts } from '../../lib/api';

type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'] & {
  media_assets_studio: { file_name: string } | null;
};

export default function UserChat() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
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
        setJobs(data as unknown as ProductionJob[]);
        
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
    
    // Poll for unread counts every 5 seconds
    const interval = setInterval(() => {
      if (profile && !loading) {
        fetchUnreadCounts(profile.id)
          .then(counts => {
            setUnreadCounts(counts);
          })
          .catch(err => console.error(err));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [profile, loading]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="w-8 h-8 border-brand-red border-t-transparent" />
      </div>
    );
  }

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-12rem)]">
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Messages</h1>
        <p className="text-slate-500 text-sm mt-1">Chat with the admin team about your specific video edits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Jobs List */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-800">
            Select a Task to Chat
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {jobs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No tasks found. Submit a video to get started!</p>
            ) : (
              jobs.map(job => {
                const unread = unreadCounts[job.id] || 0;
                
                return (
                  <button
                    key={job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setUnreadCounts(prev => ({ ...prev, [job.id]: 0 }));
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-colors border relative ${
                      selectedJobId === job.id
                        ? 'bg-red-50 border-brand-red shadow-sm'
                        : unread > 0
                          ? 'bg-red-50 border-brand-red shadow-sm'
                          : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    {unread > 0 && selectedJobId !== job.id && (
                      <div className="absolute -top-2 -right-2 bg-brand-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
                        {unread > 9 ? '9+' : unread}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-1 pr-4">
                      <FiFileText className={selectedJobId === job.id || unread > 0 ? 'text-brand-red' : 'text-slate-400'} />
                      <span className={`font-semibold text-sm truncate ${unread > 0 && selectedJobId !== job.id ? 'text-brand-red font-bold' : 'text-slate-900'}`}>
                        {job.media_assets_studio?.file_name || 'Untitled Job'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 bg-white rounded-md w-max shadow-sm border border-slate-100">
                      {job.status === 'COMPLETED' ? (
                         <FiCheck className="text-green-500" /> 
                      ) : (
                         <FiClock className="text-brand-red" />
                      )}
                      <span className={job.status === 'COMPLETED' ? 'text-green-700' : 'text-slate-700'}>
                        {job.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col min-h-0">
          {selectedJob && profile ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50">
                 <h2 className="text-md font-bold font-heading text-slate-900">
                   {selectedJob.media_assets_studio?.file_name || 'Job Chat'}
                 </h2>
               </div>
               <div className="flex-1 min-h-0 relative">
                 {/* JobChatBox needs a defined height or flex-1 to fill the container */}
                 <div className="absolute inset-0">
                   <JobChatBox jobId={selectedJob.id} currentUserId={profile.id} />
                 </div>
               </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl flex-1 flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <FiFileText className="text-4xl text-slate-300 mb-4" />
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
