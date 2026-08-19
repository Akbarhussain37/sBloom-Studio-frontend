import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import MediaGrid from '../../components/dashboard/MediaGrid';
import { getMediaAssets } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets']['Row'];

export default function ReviewFeedback() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await getMediaAssets();
        setAssets(data.filter(a => ['READY_FOR_REVIEW', 'CHANGES_REQUESTED'].includes(a.status)));
      } catch (error) {
        console.error('Error loading review assets:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mb-2">Review & Feedback</h2>
          <p className="text-slate-500 max-w-lg text-sm">
            Review edits and provide feedback to the production team.
          </p>
        </div>
      </div>

      <MediaGrid 
        assets={assets} 
        loading={loading}
        onPreview={(asset) => navigate(`/dashboard/videos/${asset.id}`)}
        emptyState={
          <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-green-500">
              <FiCheckCircle className="text-2xl" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">You're all caught up</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">No videos are currently waiting for your review.</p>
          </div>
        }
      />
    </div>
  );
}
