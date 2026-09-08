import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JobChatBox from '../../components/dashboard/JobChatBox';
import { FiSearch, FiMessageSquare, FiRefreshCw, FiEdit } from 'react-icons/fi';
import { io } from 'socket.io-client';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';
import { fetchUnreadCounts } from '../../lib/api';

type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'] & {
  media_assets_studio: { file_name: string } | null;
  profile_studio: { full_name: string; role?: string } | null;
  editor_profile?: { full_name: string; role?: string } | null;
};

export default function AdminChat() {
  const { profile, loading } = useAuth();
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastMessages, setLastMessages] = useState<Record<string, { content: string, created_at: string }>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [chatType, setChatType] = useState<'public' | 'internal'>('public');

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
        .neq('status', 'COMPLETED')
        .order('created_at', { ascending: false });

      if (jobsError) {
        throw new Error(jobsError.message);
      }

      if (jobsData) {
        // 2. Extract unique user IDs
        const userIds = Array.from(new Set([
          ...(jobsData as any[]).map(j => j.user_id).filter(Boolean),
          ...(jobsData as any[]).map(j => j.editor_id).filter(Boolean)
        ]));

        // 3. Fetch profiles for those users
        let profilesMap: Record<string, { full_name: string, role?: string }> = {};
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profile_studio')
            .select('id, full_name, role')
            .in('id', userIds);

          if (!profilesError && profilesData) {
            (profilesData as any[]).forEach(p => {
              profilesMap[p.id] = { full_name: p.full_name, role: p.role };
            });
          }
        }

        // 4. Merge the data
        let mergedJobs = (jobsData as any[]).map(job => ({
          ...job,
          profile_studio: profilesMap[job.user_id] || null,
          editor_profile: job.editor_id ? profilesMap[job.editor_id] : null
        }));

        // 4.5 Sync with backend documents to only show jobs in the Video Edit Queue
        try {
          const docRes = await fetch('http://localhost:3000/api/documents');
          if (docRes.ok) {
            const docResult = await docRes.json();
            if (docResult.success) {
              const validDocs = (docResult.data || []).filter((d: any) => d.user_name !== 'Admin Edit');
              const validFileNames = validDocs.map((d: any) => d.file_name);
              mergedJobs = mergedJobs.filter(job =>
                job.media_assets_studio && validFileNames.includes(job.media_assets_studio.file_name)
              );
            }
          }
        } catch (err) {
          console.error("Failed to fetch documents for filtering:", err);
        }

        setJobs(mergedJobs as unknown as ProductionJob[]);

        // Fetch last message for each job
        const lastMsgs: Record<string, any> = {};
        await Promise.all(mergedJobs.map(async (job: any) => {
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

  useEffect(() => {
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
        .maybeSingle();

      if (msg) {
        setLastMessages(prev => ({ ...prev, [jobId]: msg }));
      } else if (!error || error.code === 'PGRST116') {
        setLastMessages(prev => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      }
    };

    socket.on('unreadUpdate', async (data: any) => {
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

  if (loading) return null;

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
            <button
              onClick={fetchJobs}
              disabled={isLoadingData}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
              title="Refresh"
            >
              <FiEdit className="text-xl" />
            </button>
          </div>
          <div className="px-4 py-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chat..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
              {['all', 'creator', 'kid_parent', 'doctor_hospital'].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${roleFilter === role
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {role === 'all' ? 'Chats' : role === 'kid_parent' ? 'Kids' : role === 'doctor_hospital' ? 'Doctors' : 'Creators'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {(() => {
              const filteredSortedJobs = sortedJobs.filter(j => roleFilter === 'all' || j.profile_studio?.role === roleFilter || (roleFilter === 'kid_parent' && j.profile_studio?.role === 'kid') || (roleFilter === 'doctor_hospital' && j.profile_studio?.role === 'doctor'));
              return isLoadingData && jobs.length === 0 ? (
                <div className="flex justify-center p-8 text-slate-400">
                  <FiRefreshCw className="animate-spin text-2xl" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-8 text-red-500 text-sm text-center">
                  {error}
                </div>
              ) : filteredSortedJobs.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No chats found.</p>
              ) : (
                filteredSortedJobs.map((job) => {
                  const unread = unreadCounts[job.id] || 0;
                  const lastMessage = lastMessages[job.id];

                  // Format time nicely
                  let timeString = '';
                  if (lastMessage) {
                    const date = new Date(lastMessage.created_at);
                    const isToday = new Date().toDateString() === date.toDateString();
                    timeString = isToday
                      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  }

                  const creatorName = job.profile_studio?.full_name || 'Unknown User';
                  let initials = 'U';
                  if (creatorName && creatorName !== 'Unknown User') {
                    const parts = creatorName.split(' ');
                    initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
                  }

                  const roleColors: Record<string, string> = {
                    'creator': 'bg-blue-100 text-blue-700',
                    'kid': 'bg-pink-100 text-pink-700',
                    'doctor': 'bg-teal-100 text-teal-700',
                  };
                  const bgClass = roleColors[job.profile_studio?.role || 'creator'] || 'bg-slate-200 text-slate-700';

                  return (
                    <button
                      key={job.id}
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setUnreadCounts(prev => ({ ...prev, [job.id]: 0 }));
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${selectedJobId === job.id
                          ? 'bg-slate-50 border-l-4 border-brand-red'
                          : 'bg-white hover:bg-slate-50 border-l-4 border-transparent'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${bgClass}`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`font-semibold text-sm truncate ${unread > 0 && selectedJobId !== job.id ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                            {creatorName}
                          </span>
                          {timeString && (
                            <span className={`text-[10px] whitespace-nowrap ${unread > 0 ? 'text-brand-red font-bold' : 'text-slate-400'}`}>
                              {timeString}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`text-xs truncate max-w-[180px] ${unread > 0 && selectedJobId !== job.id ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                            {lastMessage ? lastMessage.content : (job.media_assets_studio?.file_name || 'Untitled Job')}
                          </span>
                          {unread > 0 && selectedJobId !== job.id && (
                            <div className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              );
            })()}
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
                    {(() => {
                      const name = selectedJob.profile_studio?.full_name || 'Unknown User';
                      if (name === 'Unknown User') return 'U';
                      const parts = name.split(' ');
                      return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
                    })()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {selectedJob.profile_studio?.full_name || 'User'}
                    </h2>
                    <p className="text-xs text-slate-500 truncate max-w-sm">
                      {selectedJob.media_assets_studio?.file_name || 'Untitled Job'} • {selectedJob.editor_profile ? `Editor: ${selectedJob.editor_profile.full_name}` : 'No Editor'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
                    <FiSearch className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Chat Tabs */}
              <div className="shrink-0 flex gap-6 border-b border-slate-100 px-6 pt-3 bg-white">
                <button
                  onClick={() => setChatType('public')}
                  className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${chatType === 'public' ? 'text-brand-red' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Client Chat
                  {chatType === 'public' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-t-full"></div>}
                </button>
                <button
                  onClick={() => setChatType('internal')}
                  className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${chatType === 'internal' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Internal Notes (Admin & Editor only)
                  {chatType === 'internal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t-full"></div>}
                </button>
              </div>

              <div className="flex-1 min-h-0 flex flex-col bg-white">
                <JobChatBox jobId={selectedJob.id} currentUserId={profile.id} chatType={chatType} key={`${selectedJob.id}-${chatType}`} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300 border border-slate-100">
                <FiMessageSquare className="text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No Chat Selected</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Select a conversation from the inbox to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
