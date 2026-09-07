import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import JobLifecycleProgressBar from '../../components/dashboard/JobLifecycleProgressBar';
import EditorJobChatBox from '../../components/dashboard/EditorJobChatBox';
import { FiFileText, FiClock, FiCheck, FiDownload } from 'react-icons/fi';
import type { Database } from '../../types/database.types';

type EditorJob = {
  id: string; // we will map doc_id to id
  media_assets_studio: { file_name: string } | null;
  file_id: string;
  status: string;
  notes: string;
  job_requirements: string;
  completion_percentage: number;
  admin_comments: string;
  user_role: string;
};

export default function EditorDashboard() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<EditorJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [slider, setSlider] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [chatType, setChatType] = useState<'public' | 'internal'>('public');

  useEffect(() => {
    async function fetchJobs() {
      if (!profile || profile.role !== 'editor') return;
      
      try {
        const res = await fetch(`http://localhost:3000/api/documents?editorId=${profile.id}`);
        const json = await res.json();
        
        if (json.success && json.data) {
          const editorDocs = json.data.filter((doc: any) => doc.editor_id === profile.id);
          
          // Cross-reference with production_jobs_studio to get the correct UUID for chat
          const { data: prodJobs } = await supabase
            .from('production_jobs_studio')
            .select('id, media_assets_studio(file_name)');
            
          const mappedJobs = editorDocs.map((doc: any) => {
            const prodJob = prodJobs?.find(pj => pj.media_assets_studio?.file_name === doc.file_name);
            
            return {
              id: prodJob ? prodJob.id : doc.doc_id, // Use production job UUID if found!
              media_assets_studio: { file_name: doc.file_name },
              file_id: doc.file_id,
              status: doc.status || 'EDITING',
              notes: doc.instructions || '',
              job_requirements: doc.job_requirements || '',
              completion_percentage: doc.completion_percentage || 0,
              admin_comments: doc.admin_comments || '',
              user_role: doc.user_role || 'user'
            };
          });
          
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error("Failed to fetch jobs via API:", err);
      }
      setLoading(false);
    }

    fetchJobs();
  }, [profile]);

  useEffect(() => {
    const job = jobs.find(j => j.id === selectedJobId);
    if (job) {
      setSlider(job.completion_percentage || 0);
    }
  }, [selectedJobId, jobs]);

  const handleSaveProgress = async () => {
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;

    try {
      const fileName = job.media_assets_studio?.file_name;
      if (!fileName) throw new Error("File name missing");

      const response = await fetch('http://localhost:3000/api/sync-job-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          completion_percentage: slider
        })
      });

      if (!response.ok) throw new Error('Failed to save details');
      
      let newStatus = 'EDITING';
      if (slider === 0) newStatus = 'UPLOADED';
      if (slider === 100) newStatus = 'COMPLETED';

      setJobs(prev => prev.map(j => j.id === job.id ? { 
        ...j, 
        completion_percentage: slider,
        status: newStatus
      } : j));

      alert('Progress saved successfully!');
    } catch (err: any) {
      alert(`Failed to save progress: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="w-8 h-8 border-brand-red border-t-transparent" />
      </div>
    );
  }

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Editor Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your assigned video tasks and chat with clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Jobs List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-800">
            Assigned Tasks
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 max-h-[600px]">
            
          <div className="flex gap-2 p-2 bg-white border-b border-slate-100 overflow-x-auto custom-scrollbar">
            {['all', 'creator', 'kid_parent', 'doctor_hospital'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  roleFilter === role 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {role === 'all' ? 'All Roles' : role === 'kid_parent' ? 'Kids' : role === 'doctor_hospital' ? 'Doctors' : 'Creators'}
              </button>
            ))}
          </div>
          {(() => {
            const displayedJobs = jobs.filter(j => roleFilter === 'all' || j.user_role === roleFilter || (roleFilter === 'kid_parent' && j.user_role === 'kid') || (roleFilter === 'doctor_hospital' && j.user_role === 'doctor'));
            return displayedJobs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No assigned tasks yet.</p>
            ) : (
              displayedJobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`w-full text-left p-3 rounded-xl transition-colors border ${
                    selectedJobId === job.id
                      ? 'bg-red-50 border-brand-red shadow-sm'
                      : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FiFileText className={selectedJobId === job.id ? 'text-brand-red' : 'text-slate-400'} />
                    <span className="font-semibold text-sm text-slate-900 truncate">
                      {job.media_assets_studio?.file_name || 'Untitled Job'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest bg-slate-100 text-slate-500">
                      {job.user_role === 'kid' ? 'KID/PARENT' : job.user_role === 'doctor' ? 'DOCTOR' : job.user_role.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 bg-white rounded-md w-max shadow-sm border border-slate-100">
                    {job.status === 'COMPLETED' ? (
                       <FiCheck className="text-green-500" /> 
                    ) : (
                       <FiClock className="text-brand-red" />
                    )}
                    <span className={job.status === 'COMPLETED' ? 'text-green-700' : 'text-slate-700'}>
                      {job.status}
                    </span>
                  </div>
                  </div>
                </button>
              ))
            );
          })()}
          </div>
        </div>

        {/* Workspace Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selectedJob && profile ? (
            <>
              {/* Top Controls: Details & Slider */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold font-heading text-slate-900">
                      {selectedJob.media_assets_studio?.file_name || 'Job Details'}
                    </h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Client Role: {selectedJob.user_role === 'kid' ? 'Kid/Parent' : selectedJob.user_role === 'doctor' ? 'Doctor/Hospital' : 'Creator'}
                    </span>
                  </div>
                  {selectedJob.file_id && (
                    <a 
                      href={`http://localhost:3000/api/documents/${selectedJob.file_id}/stream`} 
                      download={selectedJob.media_assets_studio?.file_name || 'video.mp4'}
                      className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors"
                    >
                      <FiDownload /> Download Original
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">Instructions</span>
                    <p className="text-sm mt-1 text-slate-700 whitespace-pre-wrap">
                      {selectedJob.notes || 'None'}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-500 uppercase">Requirements</span>
                    <p className="text-sm mt-1 text-blue-700 whitespace-pre-wrap">
                      {selectedJob.job_requirements || 'None'}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    Update Progress: <span>{slider}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={slider} 
                    onChange={(e) => setSlider(parseInt(e.target.value))}
                    className="w-full accent-brand-red"
                  />
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={handleSaveProgress}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                      Save Progress
                    </button>
                  </div>
                </div>

                <JobLifecycleProgressBar completionPercentage={selectedJob.completion_percentage || 0} />
              </div>

              {/* Chat Tabs */}
              <div className="flex gap-4 border-b border-slate-200">
                <button 
                  onClick={() => setChatType('public')}
                  className={`pb-2 px-1 text-sm font-bold transition-colors ${chatType === 'public' ? 'text-brand-red border-b-2 border-brand-red' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Client Chat
                </button>
                <button 
                  onClick={() => setChatType('internal')}
                  className={`pb-2 px-1 text-sm font-bold transition-colors ${chatType === 'internal' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Internal Notes (Admin & Editor only)
                </button>
              </div>
              <EditorJobChatBox jobId={selectedJob.id} currentUserId={profile.id} chatType={chatType} key={`${selectedJob.id}-${chatType}`} />
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl flex-1 flex flex-col items-center justify-center p-8 text-center shadow-sm min-h-[300px]">
              <FiFileText className="text-4xl text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Select a Task</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Click on one of your assigned jobs to view details, update progress, and chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
