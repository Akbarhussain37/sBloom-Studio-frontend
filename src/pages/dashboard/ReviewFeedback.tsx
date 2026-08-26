import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import RecentUploadsList from '../../components/dashboard/RecentUploadsList';
import { getMediaAssets } from '../../lib/creatorService';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

export default function ReviewFeedback() {
  const { profile } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    async function loadAssets() {
      try {
        const data = await getMediaAssets();
        if (isMounted) {
          setAssets(data.filter(a => ['READY_FOR_REVIEW', 'COMPLETED'].includes(a.status)));
        }
      } catch (error) {
        console.error('Error loading review assets:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    loadAssets();
    
    // Dynamically sync changes every 5 seconds
    const interval = setInterval(loadAssets, 5000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mb-2">Review Edits</h2>
          <p className="text-slate-500 max-w-lg text-sm">
            Review completed videos and provide feedback to the production team.
          </p>
        </div>
      </div>

      <RecentUploadsList 
        recentUploads={assets} 
        role={profile?.role}
        loading={loading}
      />
      
      {!loading && assets.length === 0 && (
          <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-green-500">
              <FiCheckCircle className="text-2xl" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">You're all caught up</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">No videos are currently waiting for your review.</p>
          </div>
      )}
    </div>
  );
}
