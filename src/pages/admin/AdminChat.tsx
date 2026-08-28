import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JobChatBox from '../../components/dashboard/JobChatBox';
import { FiSearch, FiMessageSquare, FiFileText, FiRefreshCw, FiAlertCircle, FiClock, FiCheck } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';
import { fetchUnreadCounts } from '../../lib/api';

type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'] & {
  media_assets_studio: { file_name: string } | null;
  profile_studio: { full_name: string } | null;
};

export default function AdminChat() {
  const { profile, loading } = useAuth();
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const fetchJobs = async () => {
    if (!profile) return;
    setIsLoadingData(true);
    setError(null);
    try {
      // 1. Fetch jobs and their media assets
      const { data: jobsData, error: jobsError } = await supabase
        .from('production_jobs_studio')
        .select(`
          *,
          media_assets_studio(file_name)
        `)
        .order('created_at', { ascending: false });

      if (jobsError) {
        throw new Error(jobsError.message);
      }

      if (jobsData) {
        // 2. Extract unique user IDs
        const userIds = Array.from(new Set((jobsData as any[]).map(j => j.user_id).filter(Boolean)));
        
        // 3. Fetch profiles for those users
        let profilesMap: Record<string, { full_name: string }> = {};
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profile_studio')
            .select('id, full_name')
            .in('id', userIds);
            
          if (!profilesError && profilesData) {
            (profilesData as any[]).forEach(p => {
              profilesMap[p.id] = { full_name: p.full_name };
            });
          }
        }

        // 4. Merge the data
        const mergedJobs = (jobsData as any[]).map(job => ({
          ...job,
          profile_studio: profilesMap[job.user_id] || null
        }));

        setJobs(mergedJobs as unknown as ProductionJob[]);

        // 5. Fetch unread messages via backend
        try {
          const counts = await fetchUnreadCounts(profile.id);
          setUnreadCounts(counts);
        } catch (err) {
          console.error("Unread query error:", err);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs.');
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Poll for unread counts every 5 seconds to keep sidebar updated
  useEffect(() => {
    fetchJobs();
    
    const interval = setInterval(() => {
      if (profile && !isLoadingData) {
        fetchUnreadCounts(profile.id)
          .then(counts => {
            setUnreadCounts(counts);
          })
          .catch(err => console.error(err));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [profile]);

  if (loading) return null;

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
            Messages
          </h2>
          <p className="text-slate-500 text-sm mt-1">Chat with users regarding their video edits.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchJobs}
            disabled={isLoadingData}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <FiRefreshCw className={isLoadingData ? "animate-spin" : ""} /> Refresh
          </button>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6">
        {/* Jobs List */}
        <div className="w-full md:w-80 lg:w-96 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm flex-shrink-0">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-800 flex justify-between items-center">
            <span>Active Chats</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {isLoadingData && jobs.length === 0 ? (
              <div className="flex justify-center p-8 text-slate-400">
                <FiRefreshCw className="animate-spin text-2xl" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-red-500 text-sm text-center">
                <FiAlertCircle className="text-2xl mb-2" />
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No jobs found.</p>
            ) : (
              jobs.map((job, index) => {
                const serialNumber = `JOB-${String(jobs.length - index).padStart(3, '0')}`;
                const unread = unreadCounts[job.id] || 0;
                
                return (
                  <button
                    key={job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      // Clear unread count optimistically
                      setUnreadCounts(prev => ({ ...prev, [job.id]: 0 }));
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-colors border relative ${
                      selectedJobId === job.id
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : unread > 0 
                          ? 'bg-red-50 border-brand-red shadow-sm'
                          : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-900'
                    }`}
                  >
                    {unread > 0 && selectedJobId !== job.id && (
                      <div className="absolute -top-2 -right-2 bg-brand-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
                        {unread > 9 ? '9+' : unread}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold text-sm truncate flex-1 pr-2">
                        {job.profile_studio?.full_name || 'Unknown User'}
                      </div>
                      <div className={`text-xs font-mono opacity-60 ${selectedJobId === job.id ? 'text-slate-300' : unread > 0 ? 'text-brand-red font-bold' : 'text-slate-500'}`}>
                        {serialNumber}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 mb-2 text-xs truncate ${selectedJobId === job.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      <FiFileText className={selectedJobId === job.id ? 'text-white' : 'text-slate-400'} />
                      <span className="truncate">{job.media_assets_studio?.file_name || 'Untitled'}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md w-max shadow-sm border ${
                      selectedJobId === job.id
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-100 text-slate-700'
                    }`}>
                      {job.status === 'COMPLETED' ? (
                         <FiCheck className={selectedJobId === job.id ? 'text-green-400' : 'text-green-500'} /> 
                      ) : (
                         <FiClock className={selectedJobId === job.id ? 'text-blue-400' : 'text-blue-500'} />
                      )}
                      <span className="capitalize">{job.status}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {selectedJob && profile ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-md font-bold font-heading text-slate-900">
                    {selectedJob.profile_studio?.full_name || 'User'}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <FiFileText /> {selectedJob.media_assets_studio?.file_name || 'Untitled'}
                  </p>
                </div>
              </div>
              <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0">
                  <JobChatBox jobId={selectedJob.id} currentUserId={profile.id} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                <FiMessageSquare className="text-3xl text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No Chat Selected</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Select a user's job from the left sidebar to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
