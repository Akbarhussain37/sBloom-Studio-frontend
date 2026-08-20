import { useState, useEffect, useMemo } from 'react';
import { FiFilm, FiAlertCircle } from 'react-icons/fi';
import { getMediaAssets } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';
import MediaGrid from '../../components/dashboard/MediaGrid';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];
type FilterType = 'All' | 'Videos' | 'Images';

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

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
    if (activeFilter === 'Videos') {
      return assets.filter(asset => asset.file_type.startsWith('video/'));
    }
    if (activeFilter === 'Images') {
      return assets.filter(asset => asset.file_type.startsWith('image/'));
    }
    return assets;
  }, [assets, activeFilter]);

  const emptyState = (
    <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
        <FiFilm className="text-2xl" />
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-1">No media metadata yet</h4>
      <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
        Media associated with your account will appear here once the media workflow is enabled.
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mb-2">Media Library</h2>
          <p className="text-slate-500 max-w-lg text-sm">
            View your securely stored media metadata.
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-red-200">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-red-400">
            <FiAlertCircle className="text-2xl" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-4">Unable to load media. Please try again.</h4>
          <button 
            onClick={loadMedia}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm inline-flex"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
            {(['All', 'Videos', 'Images'] as FilterType[]).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-[#F7F9FC] text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <MediaGrid 
            assets={filteredAssets} 
            loading={loading} 
            emptyState={emptyState}
          />
        </>
      )}
    </div>
  );
}
