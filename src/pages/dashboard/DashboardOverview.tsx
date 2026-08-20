import { useState, useEffect } from 'react';
import { FiVideo, FiClock, FiCheckCircle, FiPlus, FiFolder, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/dashboard/StatsCard';
import { getMediaAssets, getProjects } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';

type Project = Database['public']['Tables']['projects_studio']['Row'];
type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

export default function DashboardOverview() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVideos: 0,
    inProduction: 0,
    readyForReview: 0,
    completed: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentUploads, setRecentUploads] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [assets, projects] = await Promise.all([
          getMediaAssets(),
          getProjects()
        ]);

        setRecentProjects(projects.slice(0, 3));
        setRecentUploads(assets.slice(0, 4));

        const inProd = assets.filter(a => ['SUBMITTED', 'EDITING'].includes(a.status)).length;
        const inReview = assets.filter(a => ['READY_FOR_REVIEW', 'CHANGES_REQUESTED'].includes(a.status)).length;
        const completed = assets.filter(a => a.status === 'COMPLETED').length;

        setStats({
          totalVideos: assets.length,
          inProduction: inProd,
          readyForReview: inReview,
          completed: completed
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-[2rem] p-8 md:p-10 text-white shadow-lg
        ${profile?.role === 'kid' ? 'bg-gradient-to-br from-[#FFD500] via-[#FF5E00] to-[#00A3FF] shadow-[0_8px_30px_rgba(255,94,0,0.2)]' : 
          'bg-gradient-to-br from-brand-red to-[#F02865] shadow-[0_8px_30px_rgb(222,27,84,0.2)]'}`}
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0]} 👋
          </h2>
          <p className="text-white/90 max-w-md font-medium">
            {profile?.role === 'kid' ? "Let's make some awesome magic videos!" : 
             "Manage your content and production from one place."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => navigate('/dashboard/projects')}
            className={`px-6 py-3 bg-white/90 hover:bg-white text-brand-red rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all
            ${profile?.role === 'kid' ? 'text-[#FF5E00]' : 'text-brand-red'}`}
          >
            <FiFolder className="text-lg" /> Create Project
          </button>
          <button className="px-6 py-3 bg-black/10 backdrop-blur-sm text-white rounded-xl font-bold flex items-center justify-center gap-2 border border-white/5 opacity-50 cursor-not-allowed" disabled>
            <FiPlus className="text-lg" /> Upload Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Videos" 
          value={loading ? '-' : stats.totalVideos} 
          icon={<FiVideo className="text-xl" />} 
          delay={0.1}
        />
        <StatsCard 
          title="In Production" 
          value={loading ? '-' : stats.inProduction} 
          icon={<FiClock className="text-xl" />} 
          delay={0.2}
        />
        <StatsCard 
          title="Ready for Review" 
          value={loading ? '-' : stats.readyForReview} 
          icon={<FiCheckCircle className="text-xl" />} 
          delay={0.3}
        />
        <StatsCard 
          title="Completed" 
          value={loading ? '-' : stats.completed} 
          icon={<FiVideo className="text-xl" />} 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">Recent Projects</h3>
            {recentProjects.length > 0 && (
              <button 
                onClick={() => navigate('/dashboard/projects')}
                className="text-sm font-semibold text-brand-red hover:text-[#F02865] flex items-center gap-1 transition-colors"
              >
                View All <FiArrowRight />
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ) : recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map(project => (
                <div key={project.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <FiFolder className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{project.name}</h4>
                      <p className="text-sm text-slate-500">Status: {project.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
                <FiFolder className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">No projects yet</h4>
              <p className="text-slate-500 mb-4 text-sm max-w-sm mx-auto">Create a project to organize your videos and track production progress.</p>
            </div>
          )}
        </div>

        {/* Recent Uploads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">Recent Uploads</h3>
            {recentUploads.length > 0 && (
              <button 
                onClick={() => navigate('/dashboard/media')}
                className="text-sm font-semibold text-brand-red hover:text-[#F02865] flex items-center gap-1 transition-colors"
              >
                View All <FiArrowRight />
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ) : recentUploads.length > 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
              {recentUploads.map((asset, index) => (
                <div key={asset.id} className={`p-4 flex items-center gap-3 ${index !== recentUploads.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <FiVideo className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{asset.file_name}</p>
                    <p className="text-xs text-slate-500 truncate">{(asset.file_size / (1024 * 1024)).toFixed(2)} MB • {asset.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">No uploads yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
