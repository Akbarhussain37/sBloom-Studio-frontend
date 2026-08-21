import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getProductionSubmissions, type ProductionSubmissionSummary, ApiError } from '../../lib/productionApi';
import { getProjects } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { FiRefreshCw, FiAlertCircle, FiPlus } from 'react-icons/fi';

type Project = Database['public']['Tables']['projects_studio']['Row'];

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState<ProductionSubmissionSummary[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load projects for filtering
      try {
        const loadedProjects = await getProjects();
        setProjects(loadedProjects);
      } catch {
        // Fallback: If projects fail to load, just don't populate the filter
      }

      // Obtain session immediately before request
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new ApiError(401, 'UNAUTHORIZED');
      }

      const options = { limit: 50, project_id: selectedProjectId || undefined };
      const response = await getProductionSubmissions(session.access_token, options);

      // Validate response shape safely
      if (!response || !Array.isArray(response.submissions) || !response.meta || typeof response.meta.limit !== 'number') {
         throw new ApiError(500, 'INVALID_API_RESPONSE');
      }

      for (const row of response.submissions) {
        if (!row || typeof row !== 'object') throw new ApiError(500, 'INVALID_API_RESPONSE');
        if (typeof row.id !== 'string') throw new ApiError(500, 'INVALID_API_RESPONSE');
        if (typeof row.project_id !== 'string') throw new ApiError(500, 'INVALID_API_RESPONSE');
        if (typeof row.source_type !== 'string') throw new ApiError(500, 'INVALID_API_RESPONSE');
        if (typeof row.source_provider !== 'string') throw new ApiError(500, 'INVALID_API_RESPONSE');
        if (row.source_name !== null && typeof row.source_name !== 'string') throw new ApiError(500, 'INVALID_API_RESPONSE');
        if (typeof row.access_status !== 'string') throw new ApiError(500, 'INVALID_API_RESPONSE');
        if (typeof row.submitted_at !== 'string') throw new ApiError(500, 'INVALID_API_RESPONSE');
      }

      setSubmissions(response.submissions);
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'UNAUTHORIZED':
            setError('Your session has expired. Please sign in again.');
            break;
          case 'CREATOR_REQUIRED':
            setError('You do not have permission to view submission history.');
            break;
          case 'VALIDATION_ERROR':
            setError("We couldn't load that submission filter.");
            break;
          case 'NETWORK_ERROR':
            setError('A network error occurred. Please try again.');
            break;
          case 'API_CONFIGURATION_ERROR':
            setError('Submission history is temporarily unavailable.');
            break;
          default:
            setError("We couldn't load your submission history right now. Please try again.");
        }
      } else {
        setError("We couldn't load your submission history right now. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING_VERIFICATION':
        return { text: 'Pending Verification', classes: 'bg-yellow-100 text-yellow-800' };
      case 'ACCESS_CONFIRMED':
        return { text: 'Access Confirmed', classes: 'bg-green-100 text-green-800' };
      case 'ACCESS_REQUIRED':
        return { text: 'Access Required', classes: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Status Unavailable', classes: 'bg-gray-100 text-gray-800' };
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) return project.name;
    return projectId ? projectId.substring(0, 8) + '...' : 'Project';
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'Date unavailable';
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
      }).format(d);
    } catch {
      return 'Date unavailable';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Submission History</h1>
          <p className="text-slate-600 text-sm mt-1">View your past production content submissions.</p>
        </div>

        <div className="flex items-center gap-3">
          {projects.length > 0 && (
            <select
              aria-label="Filter by project"
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            aria-label="Refresh submissions"
          >
            <FiRefreshCw className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div role="alert" className="bg-red-50 text-red-800 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <FiAlertCircle className="text-4xl text-red-500" />
          <p className="font-medium">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner className="w-10 h-10 border-brand-red border-t-transparent mb-4" />
          <p className="text-slate-500 font-medium">Loading history...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="text-3xl text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No production submissions yet.</h3>
          <p className="text-slate-500 mb-6 max-w-md">
            You haven't submitted any content for production.
          </p>
          <Link
            to="/dashboard/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-brand-red/90 transition-colors shadow-sm"
          >
            <FiPlus className="text-xl" />
            Submit Content
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Source Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Project</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Type &amp; Provider</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Access Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => {
                  const status = getStatusDisplay(sub.access_status || '');
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {sub.source_name || 'Unnamed source'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          ID: {sub.id?.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700">
                          {getProjectName(sub.project_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 capitalize">
                          {sub.source_type?.toLowerCase()}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 capitalize">
                          {sub.source_provider?.replace(/_/g, ' ').toLowerCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.classes}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600">
                          {formatDate(sub.submitted_at)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
