import { useState, useEffect, useRef } from 'react';
import { FiVideo, FiClock, FiCheckCircle, FiPlus, FiFolder } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentUploadsList from '../../components/dashboard/RecentUploadsList';
import { getMediaAssets, getProjects, uploadMediaFile } from '../../lib/creatorService';
import { supabase } from '../../lib/supabase';
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
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentUploads, setRecentUploads] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Optimistically update the UI with a local blob URL so the user sees it immediately
      const optimisticAsset: MediaAsset = {
        id: Math.random().toString(),
        user_id: profile?.id || 'local',
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: URL.createObjectURL(file), // Local Blob URL
        thumbnail_path: null,
        status: 'UPLOADED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: null,
        duration: null
      };

      setRecentUploads(prev => [optimisticAsset, ...prev].slice(0, 4));
      setStats(prev => ({
        ...prev,
        totalVideos: prev.totalVideos + 1
      }));

      // Perform actual upload in background
      await uploadMediaFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [assets, projects] = await Promise.all([
          getMediaAssets(),
          getProjects()
        ]);

        setRecentProjects(projects.slice(0, 3));
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

    /* 
    // Temporarily disabled: Self-hosted Supabase often requires specific Nginx/proxy 
    // configuration for WebSockets (Realtime) to work without 400 Bad Request errors.
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media_assets_studio' },
        () => {
          console.log('Realtime update: media_assets_studio changed');
          loadData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects_studio' },
        () => {
          console.log('Realtime update: projects_studio changed');
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    */
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
            disabled={isUploading}
            className="px-6 py-3 bg-black/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-black/30 transition-colors flex items-center justify-center gap-2 border border-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiPlus className="text-lg" />
            )}
            {isUploading ? 'Uploading...' : 
             profile?.role === 'kid' ? 'Upload Clips' :
             profile?.role === 'doctor' ? 'Upload Medical Assets' :
             'Upload Content'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="video/*,image/*"
          />
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
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-heading text-slate-900">Recent Projects</h3>
            <button className="text-sm font-semibold text-brand-red hover:text-[#F02865]">View All</button>
          </div>
          
          {loading ? (
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ) : recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map(project => (
                <div key={project.id} className="p-5 rounded-2xl border border-slate-200 hover:border-brand-red/30 transition-colors bg-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <FiFolder className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{project.name}</h4>
                      <p className="text-sm text-slate-500">Status: {project.status}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                    View
                  </button>
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
              <button className="px-5 py-2.5 bg-brand-red text-white rounded-xl font-semibold hover:bg-[#F02865] transition-colors text-sm">
                Create Project
              </button>
            </div>
          )}
        </div>

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
