import { useState, useEffect, useMemo } from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getMediaAssets } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';
import MediaGrid from '../../components/dashboard/MediaGrid';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

export default function CompletedContent() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getMediaAssets();
      setAssets(data);
    } catch (error) {
      console.error('Error loading media assets:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => asset.status === 'COMPLETED');
  }, [assets]);

  const emptyState = (
    <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
        <FiCheckCircle className="text-2xl" />
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-1">No completed content yet.</h4>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mb-2">Completed Content</h2>
          <p className="text-slate-500 max-w-lg text-sm">
            View metadata for content that has completed the production workflow.
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-red-200">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-red-400">
            <FiAlertCircle className="text-2xl" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-4">Unable to load content. Please try again.</h4>
          <button 
            onClick={loadMedia}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm inline-flex"
          >
            Retry
          </button>
        </div>
      ) : (
        <MediaGrid 
          assets={filteredAssets} 
          loading={loading} 
          emptyState={emptyState}
        />
      )}
    </div>
  );
}
