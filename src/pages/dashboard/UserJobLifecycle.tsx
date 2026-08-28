import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import JobLifecycleProgressBar from '../../components/dashboard/JobLifecycleProgressBar';
import { FiFileText, FiClock, FiCheck } from 'react-icons/fi';
import type { Database } from '../../types/database.types';

type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'] & {
  media_assets_studio: { file_name: string } | null;
};

export default function UserJobLifecycle() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
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
      }
      setLoading(false);
    }

    fetchJobs();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="w-8 h-8 border-brand-red border-t-transparent" />
      </div>
    );
  }

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Job Lifecycle</h1>
        <p className="text-slate-500 text-sm mt-1">Track the progress of your edits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
        {/* Jobs List */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-800">
            Your Tasks
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 max-h-[500px]">
            {jobs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No tasks found. Submit a video to get started!</p>
            ) : (
              jobs.map(job => (
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
              ))
            )}
          </div>
        </div>

        {/* Progress Area */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {selectedJob && profile ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h2 className="text-lg font-bold font-heading text-slate-900 mb-6">
                 {selectedJob.media_assets_studio?.file_name || 'Job Details'}
               </h2>
               <JobLifecycleProgressBar status={selectedJob.status as any} />
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl flex-1 flex flex-col items-center justify-center p-8 text-center shadow-sm min-h-[300px]">
              <FiFileText className="text-4xl text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Select a Task</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Click on one of your submitted jobs on the left to track its progress.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
