import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVideo, FiClock, FiCheckCircle, FiPlus, FiFolder } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentUploadsList from '../../components/dashboard/RecentUploadsList';
import { getMediaAssets, getProjects } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';

type Project = Database['public']['Tables']['projects_studio']['Row'];
type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

export default function DashboardOverview() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalVideos: 0,
    inProduction: 0,
    readyForReview: 0,
    completed: 0,
  });

  const [recentUploads, setRecentUploads] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/dashboard/upload-job');
  };

  useEffect(() => {
    async function loadData() {
      try {
        const assets = await getMediaAssets();
        setRecentUploads(prev => {
          // Preserve optimistic local blob uploads so they don't get wiped by strict RLS policies
          const localBlobs = prev.filter(a => a.storage_path.startsWith('blob:'));
          const serverAssets = assets.filter(a => !localBlobs.find(lb => lb.file_name === a.file_name));
          return [...localBlobs, ...serverAssets].slice(0, 4);
        });

        // Calculate stats combining server assets and optimistic local blobs
        const allAssets = [...recentUploads.filter(a => a.storage_path.startsWith('blob:')), ...assets];
        
        const inProd = allAssets.filter(a => ['SUBMITTED', 'EDITING'].includes(a.status)).length;
        const inReview = allAssets.filter(a => ['READY_FOR_REVIEW', 'CHANGES_REQUESTED'].includes(a.status)).length;
        const completed = allAssets.filter(a => a.status === 'COMPLETED').length;

        setStats(prev => ({
          totalVideos: Math.max(allAssets.length, prev.totalVideos),
          inProduction: inProd,
          readyForReview: inReview,
          completed: completed
        }));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Dynamically sync changes every 5 seconds
    const intervalId = setInterval(loadData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-[2rem] p-8 md:p-10 text-white shadow-lg
        ${profile?.role === 'kid' ? 'bg-gradient-to-br from-[#FFD500] via-[#FF5E00] to-[#00A3FF] shadow-[0_8px_30px_rgba(255,94,0,0.2)]' : 
          profile?.role === 'doctor' ? 'bg-gradient-to-br from-teal-600 to-emerald-500 shadow-[0_8px_30px_rgba(20,184,166,0.2)]' : 
          'bg-gradient-to-br from-brand-red to-[#F02865] shadow-[0_8px_30px_rgb(222,27,84,0.2)]'}`}
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0]} 👋
          </h2>
          <p className="text-white/90 max-w-md font-medium">
            {profile?.role === 'kid' ? "Let's make some awesome magic videos!" : 
             profile?.role === 'doctor' ? "Manage your patient education content and professional videos." :
             "Manage your content and production from one place."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className={`px-6 py-3 bg-white rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm
            ${profile?.role === 'kid' ? 'text-[#FF5E00]' : profile?.role === 'doctor' ? 'text-teal-700' : 'text-brand-red'}`}
          >
            <FiFolder className="text-lg" /> 
            {profile?.role === 'kid' ? 'Start New Magic Video' : 
             profile?.role === 'doctor' ? 'New Patient Video' : 
             'Create Project'}
          </button>
          <button 
            onClick={handleUploadClick}
            className="px-6 py-3 bg-black/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-black/30 transition-colors flex items-center justify-center gap-2 border border-white/10"
          >
            <FiPlus className="text-lg" />
            {profile?.role === 'kid' ? 'Upload Clips' :
             profile?.role === 'doctor' ? 'Upload Medical Assets' :
             'Upload Content'}
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

      <div className="grid grid-cols-1 gap-8">
        {/* Recent Uploads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-heading text-slate-900">Recent Uploads</h3>
          </div>
          
          <RecentUploadsList 
            recentUploads={recentUploads} 
            role={profile?.role} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
}
