import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVideo, FiClock, FiCheckCircle, FiPlus, FiFolder } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentUploadsList from '../../components/dashboard/RecentUploadsList';
import { getMediaAssets } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';

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
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-[2rem] p-8 md:p-10 text-white shadow-lg bg-[var(--color-hero-bg)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-2 text-white">
            Welcome back, <span className="text-[var(--color-hero-text)]">{profile?.full_name?.split(' ')[0]}</span>!
          </h2>
          <p className="text-slate-400 max-w-md font-medium text-sm mt-4">
            {profile?.role === 'kid' ? "Let's make some awesome magic videos!" : 
             profile?.role === 'doctor' ? "Manage your patient education content and professional videos." :
             "Manage your content and production from one place."}
          </p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-3 bg-[#242940] rounded-xl font-bold text-white hover:bg-[#2A304B] transition-colors flex items-center justify-center gap-2 border border-white/10 shadow-sm">
            <FiFolder className="text-lg" /> 
            {profile?.role === 'kid' ? 'Start New Magic Video' : 
             profile?.role === 'doctor' ? 'New Patient Video' : 
             'Create Project'}
          </button>
          <button 
            onClick={handleUploadClick}
            className="px-6 py-3 bg-[var(--color-sidebar-active)] text-white rounded-xl font-bold hover:bg-violet-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
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
          iconColor="text-emerald-500"
          iconBgColor="bg-emerald-50"
        />
        <StatsCard 
          title="In Production"
          value={loading ? '-' : stats.inProduction} 
          icon={<FiClock className="text-xl" />} 
          delay={0.2}
          iconColor="text-red-500"
          iconBgColor="bg-red-50"
        />
        <StatsCard 
          title="Ready for Review"
          value={loading ? '-' : stats.readyForReview} 
          icon={<FiCheckCircle className="text-xl" />} 
          delay={0.3}
          iconColor="text-orange-500"
          iconBgColor="bg-orange-50"
        />
        <StatsCard 
          title="Completed"
          value={loading ? '-' : stats.completed} 
          icon={<FiVideo className="text-xl" />} 
          delay={0.4}
          iconColor="text-violet-500"
          iconBgColor="bg-violet-50"
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
